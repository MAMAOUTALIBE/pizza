import type { MetadataRoute } from "next";
import { site } from "@/data/site";

/** robots.txt — indexation du site public, exclusion de l'admin et de l'API. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
