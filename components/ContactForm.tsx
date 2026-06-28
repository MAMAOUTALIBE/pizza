"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { CTAButtonAction } from "@/components/ui/CTAButton";

type Status = "idle" | "submitting" | "success" | "error";
type ContactResponse = { ok?: boolean; error?: string; delivered?: boolean };

const subjects = [
  "Question générale",
  "Réservation",
  "Commande / livraison",
  "Événement / privatisation",
  "Autre",
];

/**
 * Formulaire de contact contrôlé avec validation basique.
 * Envoie la demande vers /api/contact, qui valide et route le message serveur.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => ({}))) as ContactResponse;
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Impossible d'envoyer le message.");
      }
      setStatus("success");
      form.reset();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Impossible d'envoyer le message.",
      );
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-10 text-center shadow-card">
        <CheckCircle2 className="h-14 w-14 text-basil-500" aria-hidden />
        <h3 className="mt-4 font-display text-2xl font-bold uppercase text-charcoal-900">
          Message reçu&nbsp;!
        </h3>
        <p className="mt-2 max-w-sm text-charcoal-800/70">
          Merci de nous avoir contactés. Notre équipe vous répondra dans les
          plus brefs délais.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-semibold text-terracotta-600 hover:underline"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-3xl bg-white p-7 shadow-card sm:p-8"
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nom complet" htmlFor="name">
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className={inputClass}
            placeholder="Marco Rossi"
          />
        </Field>
        <Field label="Téléphone" htmlFor="phone">
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className={inputClass}
            placeholder="06 12 34 56 78"
          />
        </Field>
      </div>

      <Field label="Email" htmlFor="email">
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputClass}
          placeholder="vous@exemple.fr"
        />
      </Field>

      <Field label="Sujet" htmlFor="subject">
        <select id="subject" name="subject" className={inputClass} defaultValue="">
          <option value="" disabled>
            Choisissez un sujet
          </option>
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Votre message" htmlFor="message">
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className={`${inputClass} resize-y`}
          placeholder="Bonjour, je souhaiterais…"
        />
      </Field>

      <CTAButtonAction
        type="submit"
        size="lg"
        className="w-full"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? (
          "Envoi en cours…"
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden />
            Envoyer le message
          </>
        )}
      </CTAButtonAction>

      {status === "error" && (
        <p className="rounded-xl bg-tomato-500/10 px-4 py-3 text-sm text-tomato-600">
          {errorMessage}
        </p>
      )}

      <p className="text-center text-xs text-charcoal-800/50">
        Vos données sont utilisées uniquement pour traiter votre demande.
      </p>
    </form>
  );
}

const inputClass =
  "w-full rounded-xl border border-charcoal-900/15 bg-cream-50 px-4 py-3 text-sm text-charcoal-900 placeholder:text-charcoal-800/40 transition-colors focus:border-terracotta-500 focus:outline-none focus:ring-2 focus:ring-terracotta-500/30";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1.5 block text-sm font-medium text-charcoal-900">
        {label}
      </span>
      {children}
    </label>
  );
}
