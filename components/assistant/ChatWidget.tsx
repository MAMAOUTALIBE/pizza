"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const GREETING =
  "Ciao ! Je suis Bella 🍕 Posez-moi vos questions sur la carte, les horaires ou la livraison, et je vous aiguille.";

const SUGGESTIONS = [
  "Une pizza végé pas trop chère ?",
  "Vos horaires ?",
  "Frais de livraison ?",
];

interface ChatWidgetProps {
  endpoint?: string;
  title?: string;
  subtitle?: string;
  greeting?: string;
  suggestions?: string[];
  launchLabel?: string;
}

/**
 * Assistant conversationnel réutilisable (Bella côté client, Copilote côté
 * back-office). Bulle flottante + panneau de chat en streaming, dégradé
 * proprement si l'API est indisponible.
 */
export function ChatWidget({
  endpoint = "/api/assistant",
  title = "Bella",
  subtitle = "Assistante La Bella",
  greeting = GREETING,
  suggestions = SUGGESTIONS,
  launchLabel = "Ouvrir l'assistant Bella",
}: ChatWidgetProps = {}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll vers le bas à chaque nouveau contenu.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open]);

  // Focus à l'ouverture + fermeture par Échap.
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;

    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok || !res.body) throw new Error("network");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((cur) => {
          const copy = [...cur];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch {
      setMessages((cur) => {
        const copy = [...cur];
        copy[copy.length - 1] = {
          role: "assistant",
          content: "Désolée, une erreur est survenue. Réessayez ou appelez-nous.",
        };
        return copy;
      });
    } finally {
      setStreaming(false);
      inputRef.current?.focus();
    }
  }

  return (
    <>
      {/* Lanceur flottant (au-dessus de la bottom-nav sur mobile) */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={launchLabel}
          className="fixed right-4 bottom-[calc(4.75rem_+_env(safe-area-inset-bottom))] z-50 flex h-14 w-14 items-center justify-center rounded-full bg-terracotta-500 text-white shadow-glow transition-transform hover:bg-terracotta-600 active:scale-95 lg:bottom-6 lg:right-6"
        >
          <MessageCircle className="h-6 w-6" aria-hidden />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-basil-500 text-white">
            <Sparkles className="h-2.5 w-2.5" aria-hidden />
          </span>
        </button>
      )}

      {/* Panneau de chat */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="fixed inset-x-3 bottom-[calc(4.75rem_+_env(safe-area-inset-bottom))] z-50 flex max-h-[70vh] flex-col overflow-hidden rounded-3xl border border-charcoal-900/10 bg-cream-50 shadow-2xl lg:inset-x-auto lg:right-6 lg:bottom-6 lg:h-[600px] lg:max-h-[80vh] lg:w-[380px]"
        >
          {/* En-tête */}
          <header className="flex items-center justify-between gap-2 bg-charcoal-950 px-4 py-3 text-cream-50">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-terracotta-500">
                <Sparkles className="h-4 w-4" aria-hidden />
              </span>
              <span>
                <span className="block font-display text-sm font-bold uppercase tracking-wide">
                  {title}
                </span>
                <span className="block text-[0.7rem] text-cream-200/70">{subtitle}</span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer"
              className="flex h-9 w-9 items-center justify-center rounded-full text-cream-200/80 transition-colors hover:bg-white/10 hover:text-cream-50"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </header>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            aria-live="polite"
          >
            <Bubble role="assistant" content={greeting} />
            {messages.map((m, i) => (
              <Bubble key={i} role={m.role} content={m.content} />
            ))}

            {/* Suggestions au premier contact */}
            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-terracotta-500/40 bg-white px-3 py-1.5 text-xs font-medium text-terracotta-600 transition-colors hover:bg-terracotta-500 hover:text-white"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Saisie */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-charcoal-900/10 bg-white p-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Votre question…"
              aria-label="Votre message"
              className="min-h-[44px] flex-1 rounded-full border border-charcoal-900/15 bg-cream-50 px-4 text-sm text-charcoal-900 placeholder:text-charcoal-800/40 focus:border-terracotta-500 focus:outline-none focus:ring-2 focus:ring-terracotta-500/30"
            />
            <button
              type="submit"
              disabled={streaming || !input.trim()}
              aria-label="Envoyer"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-terracotta-500 text-white transition-colors hover:bg-terracotta-600 disabled:opacity-50"
            >
              <Send className="h-4 w-4" aria-hidden />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

// Liens cliquables : URLs absolues + chemins internes connus (lien de paiement…).
const LINK_RE =
  /(https?:\/\/[^\s)]+|\/(?:commander(?:\/[^\s)]*)?|notre-carte|nos-pizzas|menus|a-propos|contact))/g;

function renderContent(text: string, isUser: boolean) {
  return text.split(LINK_RE).map((part, i) => {
    if (i % 2 === 0) return <span key={i}>{part}</span>;
    const internal = part.startsWith("/");
    return (
      <a
        key={i}
        href={part}
        target={internal ? undefined : "_blank"}
        rel={internal ? undefined : "noopener noreferrer"}
        className={"font-semibold underline " + (isUser ? "text-white" : "text-terracotta-600")}
      >
        {part}
      </a>
    );
  });
}

function Bubble({ role, content }: Msg) {
  const isUser = role === "user";
  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <p
        className={
          "max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed " +
          (isUser
            ? "rounded-br-md bg-terracotta-500 text-white"
            : "rounded-bl-md bg-white text-charcoal-900 shadow-card")
        }
      >
        {content ? (
          renderContent(content, isUser)
        ) : (
          <span className="inline-flex gap-1 text-charcoal-800/40">●●●</span>
        )}
      </p>
    </div>
  );
}
