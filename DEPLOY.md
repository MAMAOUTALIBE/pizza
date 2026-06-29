# 🚀 Déploiement sur VPS Hostinger (Ubuntu)

Guide complet pour mettre **La Bella Pizzeria** en production sur un VPS Hostinger
(Ubuntu 22.04 / 24.04), avec **PM2**, **Nginx** (reverse proxy) et **HTTPS** (Certbot).

> Stack : Next.js 16 (App Router, SSR + routes API) → **nécessite Node.js**, ce
> n'est PAS un export statique. On lance `next start` derrière Nginx.

---

## 0. Prérequis

- Un VPS Hostinger avec **Ubuntu** et un accès **SSH** (root ou sudo).
- Un **nom de domaine** dont les enregistrements DNS **A** (et **AAAA** si IPv6)
  pointent vers l'**IP du VPS** (ex. `labellapizzeria.fr` et `www`).
- Connexion : `ssh root@VOTRE_IP`

---

## 1. Préparer le serveur

```bash
apt update && apt upgrade -y
# Node.js 20 LTS (requis par Next 16)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs git nginx
node -v   # doit afficher v20.x
# PM2 (gestionnaire de process)
npm install -g pm2
```

---

## 2. Récupérer l'application

```bash
mkdir -p /var/www && cd /var/www
# Option A — depuis un dépôt Git
git clone VOTRE_REPO labella && cd labella
# Option B — upload via scp/SFTP du dossier projet vers /var/www/labella
```

---

## 3. Variables d'environnement

```bash
cd /var/www/labella
cp .env.production.example .env
nano .env
```

- **`AUTH_SECRET`** (obligatoire) : `openssl rand -base64 32`
- **`NEXT_PUBLIC_SITE_URL`** : `https://votre-domaine`
- Base de données / Stripe / Resend : voir §6 (optionnels — sans eux, le site
  fonctionne en mode démo, mais sans persistance ni paiement réel).

---

## 4. Installer, builder, lancer

```bash
npm ci                 # installe les dépendances (reproductible)
npx prisma generate    # génère le client Prisma (nécessaire au build)
npm run build          # build de production

# Démarrage via PM2 (adaptez cwd dans ecosystem.config.cjs si besoin)
pm2 start ecosystem.config.cjs
pm2 save               # sauvegarde la liste des process
pm2 startup            # exécutez la commande affichée pour le démarrage auto au boot
```

Vérifier : `curl http://127.0.0.1:3000/api/health` → `{"status":"ok",...}`

---

## 5. Nginx + HTTPS

```bash
# Copier la conf (ajustez le server_name avec votre domaine)
cp deploy/nginx-labella.conf /etc/nginx/sites-available/labella
nano /etc/nginx/sites-available/labella   # remplacez labellapizzeria.fr
ln -s /etc/nginx/sites-available/labella /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# Certificat TLS gratuit (Let's Encrypt)
apt install -y certbot python3-certbot-nginx
certbot --nginx -d labellapizzeria.fr -d www.labellapizzeria.fr
# Certbot configure le HTTPS + la redirection 80→443 automatiquement.
```

Le renouvellement TLS est automatique (timer systemd `certbot.timer`).

---

## 6. Activer la persistance et les paiements (optionnel mais recommandé en prod)

### Base de données PostgreSQL
```bash
apt install -y postgresql
sudo -u postgres psql -c "CREATE DATABASE labella;"
sudo -u postgres psql -c "CREATE USER labella WITH PASSWORD 'motdepasse';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE labella TO labella;"
```
Dans `.env` : `DATABASE_URL="postgresql://labella:motdepasse@localhost:5432/labella?schema=public"`
et `PERSIST_ORDERS="true"`. Puis :
```bash
npx prisma migrate deploy   # applique le schéma
npm run db:seed             # données de démonstration (optionnel)
pm2 restart labella
```

### Stripe (paiement en ligne réel)
- Renseignez `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
- Créez un **webhook** Stripe pointant sur `https://votre-domaine/api/stripe/webhook`
  (événements `checkout.session.completed`, `checkout.session.async_payment_succeeded`)
  et mettez le secret dans `STRIPE_WEBHOOK_SECRET`. `pm2 restart labella`.

### Emails (Resend)
- Renseignez `RESEND_API_KEY` + `CONTACT_FROM_EMAIL` (domaine vérifié). `pm2 restart labella`.

---

## 7. Pare-feu (recommandé)

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

---

## 8. ✅ Checklist AVANT d'ouvrir au public

- [ ] **`AUTH_SECRET`** fort (>= 32 car., `openssl rand -base64 32`) défini dans
      l'environnement. ⚠️ En production l'app **refuse de démarrer** sans un secret
      fort (plus de fallback forgeable) — c'est voulu.
- [ ] **Connexion admin** : la connexion par **comptes de démo** (`demo`) est
      **désactivée automatiquement en production** (`NODE_ENV=production`). Pour de
      vrais comptes : activez la persistance (`PERSIST_ORDERS=true` + `DATABASE_URL`)
      et lancez `npm run db:seed` — les comptes sont créés avec des **mots de passe
      hachés (bcrypt)**. Identifiants par défaut : email ci-dessus + `SEED_ADMIN_PASSWORD`
      (ou `LaBella!2026`). **Changez ce mot de passe** après la 1re connexion.
- [ ] HTTPS actif (cadenas vert) + redirection HTTP→HTTPS.
- [ ] `NEXT_PUBLIC_SITE_URL` = domaine réel (URLs Stripe/sitemap correctes).
- [ ] Stripe en **clés live** + webhook configuré (si paiement en ligne).
- [ ] `robots.txt` (auto) exclut `/admin` et `/api` ; `/sitemap.xml` accessible.
- [ ] Sauvegardes base de données planifiées (si DB activée).
- [ ] Remplacer les coordonnées de démo dans `data/site.ts` (adresse, tél, email)
      et les mentions légales (`app/(site)/mentions-legales`).

---

## 9. Mettre à jour le site (redéploiement)

```bash
cd /var/www/labella
git pull                       # ou ré-uploadez les fichiers
npm ci && npx prisma generate
npm run build
pm2 restart labella
```

---

## 10. Commandes utiles & dépannage

| Besoin | Commande |
| --- | --- |
| Logs applicatifs | `pm2 logs labella` |
| Statut / monitoring | `pm2 status` · `pm2 monit` |
| Redémarrer | `pm2 restart labella` |
| Tester Nginx | `nginx -t` |
| Logs Nginx | `tail -f /var/log/nginx/error.log` |
| Santé app | `curl http://127.0.0.1:3000/api/health` |

- **502 Bad Gateway** : l'app n'écoute pas → `pm2 status`, `pm2 logs`.
- **Build qui manque de RAM** (petit VPS) : créez un swap de 2 Go
  (`fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile`).
- **Images non optimisées** : Next installe `sharp` automatiquement ; si erreur,
  `npm install sharp` puis rebuild.

---

## (Avancé) Alternative Docker

L'app peut aussi tourner en conteneur (Hostinger VPS supporte Docker). Le mode
`next start` + PM2 ci-dessus reste le plus simple ; passez à Docker si vous
gérez déjà vos services en conteneurs.
