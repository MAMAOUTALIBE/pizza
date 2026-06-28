import { PrismaClient } from "@prisma/client";

/**
 * Client Prisma (serveur uniquement), instancié paresseusement et réutilisé
 * entre les rechargements à chaud en dev (évite la multiplication de connexions).
 *
 * La persistance est **désactivée par défaut** (mode démo) : sans
 * PERSIST_ORDERS="true", les commandes ne sont pas écrites en base et le site
 * fonctionne sans PostgreSQL. Activez-la quand une vraie base est branchée.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export function isPersistenceEnabled(): boolean {
  return process.env.PERSIST_ORDERS === "true" && Boolean(process.env.DATABASE_URL);
}

export function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }
  return globalForPrisma.prisma;
}
