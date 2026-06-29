/** @type {import('next.js').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Masque l'en-tête X-Powered-By: Next.js (réduction d'empreinte).
  poweredByHeader: false,
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
  // En-têtes de sécurité appliqués à toutes les routes.
  async headers() {
    const securityHeaders = [
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-DNS-Prefetch-Control", value: "on" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      // HSTS : effectif uniquement en HTTPS (configurez le TLS via Nginx/Certbot).
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
    ];
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
