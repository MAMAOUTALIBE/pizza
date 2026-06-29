import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { pizzas } from "@/data/pizzas";

/** Sitemap des pages publiques + fiches pizzas. */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/notre-carte",
    "/nos-pizzas",
    "/menus",
    "/a-propos",
    "/contact",
    "/commander",
    "/mentions-legales",
    "/politique-de-confidentialite",
  ];

  const pages: MetadataRoute.Sitemap = routes.map((r) => ({
    url: `${site.url}${r}`,
    changeFrequency: "weekly",
    priority: r === "" ? 1 : 0.7,
  }));

  const products: MetadataRoute.Sitemap = pizzas.map((p) => ({
    url: `${site.url}/nos-pizzas/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...pages, ...products];
}
