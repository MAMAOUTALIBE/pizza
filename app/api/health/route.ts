import { NextResponse } from "next/server";

// Healthcheck (PM2 / monitoring / load-balancer). Toujours dynamique.
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ status: "ok", uptime: process.uptime() });
}
