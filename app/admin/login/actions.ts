"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  authenticate,
  createSessionToken,
  cookieOptions,
  SESSION_COOKIE,
} from "@/lib/admin/auth";

/** Action de connexion : vérifie les identifiants et pose le cookie de session. */
export async function loginAction(
  _prevState: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string }> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "/admin");

  const session = await authenticate(email, password);
  if (!session) {
    return { error: "Identifiants invalides." };
  }

  (await cookies()).set(SESSION_COOKIE, createSessionToken(session), cookieOptions);
  redirect(from.startsWith("/admin") ? from : "/admin");
}

/** Action de déconnexion : supprime le cookie de session. */
export async function logoutAction() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}
