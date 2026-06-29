import { streamAgent, type ChatMessage } from "./agent";
import { buildStaffPrompt } from "./staff-prompt";
import { STAFF_TOOLS, executeStaffTool } from "./staff-tools";

/** Copilote staff (back-office) — réutilise la boucle d'agent générique. */
export function runStaffAssistant(history: ChatMessage[]): ReadableStream<Uint8Array> {
  return streamAgent(
    { system: buildStaffPrompt(), tools: STAFF_TOOLS, execute: executeStaffTool },
    history,
  );
}
