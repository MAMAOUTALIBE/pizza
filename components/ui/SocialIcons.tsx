import { Facebook, Instagram } from "lucide-react";
import type { SocialLink } from "@/lib/types";

/** Icône TikTok (absente de lucide-react) — tracé inline. */
function TikTok({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M16.5 3c.4 2.3 1.7 3.7 4 4v2.6c-1.4.1-2.7-.3-4-1v6.1c0 3.4-2.5 5.8-5.7 5.8C7.4 20.5 5 18 5 14.9c0-3 2.3-5.3 5.3-5.3.4 0 .8 0 1.2.1v2.8c-.4-.1-.8-.2-1.2-.2-1.4 0-2.5 1.1-2.5 2.6 0 1.5 1.1 2.7 2.6 2.7 1.5 0 2.6-1.1 2.6-2.9V3h3.5z" />
    </svg>
  );
}

const map = {
  facebook: Facebook,
  instagram: Instagram,
  tiktok: TikTok,
} as const;

/** Rangée de liens vers les réseaux sociaux. */
export function SocialIcons({ links }: { links: SocialLink[] }) {
  return (
    <ul className="flex items-center gap-3">
      {links.map((social) => {
        const Icon = map[social.icon];
        return (
          <li key={social.label}>
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-cream-50/10 text-cream-100 transition-colors hover:bg-terracotta-500 hover:text-white"
            >
              <Icon className="h-5 w-5" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
