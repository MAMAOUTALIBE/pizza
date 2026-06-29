/**
 * Configuration de l'assistant IA « Bella ».
 *
 * L'agent fonctionne en dégradation gracieuse : sans ANTHROPIC_API_KEY, la
 * route /api/assistant renvoie un message de repli statique (le widget reste
 * utilisable). Avec la clé, l'agent Claude raisonne et appelle les outils.
 */

/** Modèle principal de l'agent (le plus capable de la gamme Opus). */
export const AI_MODEL = "claude-opus-4-8";

/** Plafond de tokens par réponse — les réponses de chat sont courtes. */
export const AI_MAX_TOKENS = 1024;

/** Nombre maximum d'allers-retours d'outils dans une boucle d'agent. */
export const AI_MAX_TOOL_ROUNDS = 5;

/** L'agent IA est-il actif ? (clé API présente). */
export function isAiEnabled(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}
