/** @type {import('next.js').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Illustrations de pizza first-party en SVG (public/images/pizzeria/pizzas/*)
    // pour les pizzas sans photo dédiée. CSP sandbox = rendu sûr.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    formats: ["image/avif", "image/webp"],
    // Autoriser des CDN d'images distants si besoin plus tard (ex. Unsplash, Cloudinary).
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
