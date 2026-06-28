import { ShieldCheck, Database, FileText } from "lucide-react";
import { PageHeader, Card } from "@/components/admin/ui/kit";
import { AiAssistant } from "@/components/admin/modules/AiAssistant";

const guardrails = [
  { icon: Database, title: "Données du CRM uniquement", text: "Horaires, carte, prix et disponibilités proviennent de la base — l'IA n'invente jamais un prix." },
  { icon: ShieldCheck, title: "Garde-fous", text: "Aucune information interne divulguée. L'assistant peut être désactivé depuis les paramètres." },
  { icon: FileText, title: "Conversations journalisées", text: "Chaque échange est tracé (modèle AiConversation) pour amélioration continue." },
];

export default function IaPage() {
  return (
    <>
      <PageHeader
        title="Assistant IA"
        description="Chatbot client connecté aux données du restaurant : commandes, horaires, carte, allergènes."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AiAssistant />
        </div>
        <div className="space-y-4">
          {guardrails.map((g) => (
            <Card key={g.title}>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta-50 text-terracotta-600">
                <g.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 text-sm font-semibold text-slate-900">{g.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{g.text}</p>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
