import { expect, test } from "@playwright/test";

test("customer can add pizzas and submit a pickup order", async ({ page }) => {
  await page.goto("/commander");
  await page.getByLabel("Ajouter Margherita à la commande").first().click();
  await page.getByRole("button", { name: "À emporter" }).click();

  await expect(page.getByText("1 article")).toBeVisible();
  await expect(page.getByText("Margherita").last()).toBeVisible();

  await page.getByPlaceholder("Nom complet").fill("Audit Test");
  await page.getByPlaceholder("Téléphone").fill("0612345678");
  await page.getByRole("button", { name: /Valider la commande/i }).click();

  await expect(page.getByText("Commande reçue")).toBeVisible();
  await expect(page.getByText(/WEB-\d{8}-/)).toBeVisible();
});

test("contact form posts to the API and shows confirmation", async ({ page }) => {
  await page.goto("/contact");
  await page.getByLabel("Nom complet").fill("Audit Test");
  await page.getByLabel("Email").fill("audit@example.com");
  await page.getByLabel("Votre message").fill("Bonjour, ceci est un test.");
  await page.getByRole("button", { name: /Envoyer le message/i }).click();

  await expect(page.getByText("Message reçu")).toBeVisible();
});

test("driver role is redirected before restricted admin data is rendered", async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill("livreur@labella.fr");
  await page.getByLabel("Mot de passe").fill("demo");
  await page.getByRole("button", { name: /Se connecter/i }).click();
  await expect(page).toHaveURL(/\/admin$/);

  await page.goto("/admin/utilisateurs");
  await expect(page).toHaveURL(/\/admin\/acces-refuse/);
  await expect(page.getByText("Accès refusé")).toBeVisible();
  await expect(page.getByText("Giovanni Bianchi")).toHaveCount(0);
});
