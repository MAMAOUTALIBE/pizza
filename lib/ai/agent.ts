import Anthropic from "@anthropic-ai/sdk";
import { site } from "@/data/site";
import { AI_MODEL, AI_MAX_TOKENS, AI_MAX_TOOL_ROUNDS } from "./config";
import { buildSystemPrompt } from "./prompt";
import { TOOLS, executeTool } from "./tools";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AgentConfig {
  /** System prompt (statique → mis en cache). */
  system: string;
  /** Outils exposés au modèle. */
  tools: Anthropic.Tool[];
  /** Exécuteur d'outil (renvoie le résultat JSON sérialisé). */
  execute: (name: string, input: unknown) => Promise<string>;
}

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!client) client = new Anthropic(); // lit ANTHROPIC_API_KEY
  return client;
}

/**
 * Boucle d'agent générique en streaming (réutilisée par l'assistant client ET
 * le copilote staff) : streaming token-par-token, tool use serveur, prompt
 * caching du system prompt, gestion refusal/erreurs.
 */
export function streamAgent(config: AgentConfig, history: ChatMessage[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (text: string) => controller.enqueue(encoder.encode(text));

      try {
        const anthropic = getClient();
        const system: Anthropic.TextBlockParam[] = [
          { type: "text", text: config.system, cache_control: { type: "ephemeral" } },
        ];
        const messages: Anthropic.MessageParam[] = history.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        for (let round = 0; round < AI_MAX_TOOL_ROUNDS; round++) {
          const stream = anthropic.messages.stream({
            model: AI_MODEL,
            max_tokens: AI_MAX_TOKENS,
            system,
            tools: config.tools,
            messages,
          });

          for await (const event of stream) {
            if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
              send(event.delta.text);
            }
          }

          const final = await stream.finalMessage();

          if (final.stop_reason === "tool_use") {
            messages.push({ role: "assistant", content: final.content });
            const results: Anthropic.ToolResultBlockParam[] = [];
            for (const block of final.content) {
              if (block.type === "tool_use") {
                results.push({
                  type: "tool_result",
                  tool_use_id: block.id,
                  content: await config.execute(block.name, block.input),
                });
              }
            }
            messages.push({ role: "user", content: results });
            continue;
          }

          if (final.stop_reason === "refusal") {
            send(`\n\nDésolée, je ne peux pas répondre à cette demande.`);
          }
          break;
        }
      } catch (error) {
        console.error("Agent error", error);
        send(
          "\n\nOups, je rencontre un petit souci technique. Réessayez dans un instant, ou appelez-nous au " +
            site.phone +
            ".",
        );
      } finally {
        controller.close();
      }
    },
  });
}

/** Assistant client « Bella ». */
export function runAssistant(history: ChatMessage[]): ReadableStream<Uint8Array> {
  return streamAgent({ system: buildSystemPrompt(), tools: TOOLS, execute: executeTool }, history);
}
