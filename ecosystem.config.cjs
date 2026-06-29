/**
 * Configuration PM2 — exécute le serveur Next.js en production sur le VPS.
 * Lancement : pm2 start ecosystem.config.cjs
 * (adaptez `cwd` au chemin réel de l'application sur le serveur)
 */
module.exports = {
  apps: [
    {
      name: "labella",
      script: "npm",
      args: "start", // -> next start (lit PORT)
      cwd: "/var/www/labella",
      instances: 1, // passez à "max" + exec_mode "cluster" si besoin (attention au rate-limit en mémoire)
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
