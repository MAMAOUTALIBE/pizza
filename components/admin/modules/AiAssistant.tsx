"use client";

import { useState } from "react";
import { Send, Bot, User } from "lucide-react";
import { site, hoursSummary } from "@/data/site";
import { pizzas } from "@/data/pizzas";
import { formatPrice } from "@/lib/utils";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

/**
 * Démo de l'assistant IA client.
 * Les réponses sont générées localement à partir des DONNÉES DU CRM
 * (horaires, adresse, prix) — l'IA n'invente jamais les prix.
 * En production : appel à /api/admin/ai (Claude) avec ces données en contexte
 * (RAG), journalisation des conversations et garde-fous.
 */
function answer(question: string): string {
  const q = question.toLowerCase();
  if (q.includes("horaire") || q.includes("ouvert") || q.includes("heure")) {
    return `Nous sommes ${hoursSummary}. Vous pouvez commander en ligne ou par téléphone au ${site.phone}.`;
  }
  if (q.includes("adresse") || q.includes("où") || q.includes("situé")) {
    return `Vous nous trouverez au ${site.address.full}. À très vite !`;
  }
  if (q.includes("livr")) {
    return "Oui, nous livrons 7j/7 de 11h à 23h, à domicile ou au bureau, en moins de 30 minutes selon la zone.";
  }
  if (q.includes("végét") || q.includes("vegan") || q.includes("vegetar")) {
    const veg = pizzas.filter((p) => p.tags.includes("Végétarienne")).map((p) => p.name);
    return `Nos pizzas végétariennes : ${veg.join(", ")}. La Vegetariana est très appréciée !`;
  }
  if (q.includes("prix") || q.includes("combien") || q.includes("coûte")) {
    const m = pizzas.find((p) => q.includes(p.name.toLowerCase()));
    if (m) return `La pizza ${m.name} est à ${formatPrice(m.price)}.`;
    const min = Math.min(...pizzas.map((p) => p.price));
    return `Nos pizzas démarrent à ${formatPrice(min)}. Quelle pizza vous intéresse ?`;
  }
  if (q.includes("allerg")) {
    return "Indiquez-nous vos allergies lors de la commande : la cuisine en sera informée. Nous proposons aussi une pâte sans gluten.";
  }
  if (q.includes("recommand") || q.includes("conseil") || q.includes("meilleur")) {
    return "Nos best-sellers : la Margherita, la Diavola et la 4 Fromages. Envie de classique ou d'épicé ?";
  }
  return "Je peux vous renseigner sur nos horaires, l'adresse, la livraison, les prix, les allergènes ou vous recommander une pizza. Que souhaitez-vous savoir ?";
}

const suggestions = ["Quels sont vos horaires ?", "Vous livrez ?", "Une pizza végétarienne ?", "Combien coûte la Diavola ?"];

export function AiAssistant() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Bonjour 👋 Je suis l'assistant de La Bella. Comment puis-je vous aider ?" },
  ]);
  const [input, setInput] = useState("");

  function send(text: string) {
    const content = text.trim();
    if (!content) return;
    setMessages((m) => [...m, { role: "user", content }, { role: "assistant", content: answer(content) }]);
    setInput("");
  }

  return (
    <div className="flex h-[32rem] flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-terracotta-500 text-white">
          <Bot className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Assistant La Bella</p>
          <p className="text-xs text-emerald-600">● En ligne · connecté aux données du CRM</p>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${m.role === "user" ? "bg-slate-200 text-slate-600" : "bg-terracotta-100 text-terracotta-600"}`}>
              {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </span>
            <p className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.role === "user" ? "bg-terracotta-500 text-white" : "bg-slate-100 text-slate-700"}`}>
              {m.content}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-100 p-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button key={s} onClick={() => send(s)} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 hover:bg-slate-200">
              {s}
            </button>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question…"
            className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-terracotta-500 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20"
          />
          <button type="submit" className="rounded-lg bg-terracotta-500 px-4 py-2 text-white hover:bg-terracotta-600">
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
