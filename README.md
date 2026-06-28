# 🍕 La Bella Pizzeria

Site vitrine **+** back-office (CRM) complet pour une pizzeria, construit avec
**Next.js 14 (App Router), React, TypeScript et Tailwind CSS**.

Le projet est livré en deux espaces distincts :

| Espace | URL | Description |
| --- | --- | --- |
| **Site public** | `/` | Vitrine premium orientée conversion : carte, pizzas, menus, à propos, contact, commande. |
| **Back-office** | `/admin` | CRM complet (24 modules) pour piloter toute l'activité du restaurant. |

---

## 🚀 Démarrage rapide

```bash
npm install
npm run dev          # http://localhost:3000
```

Build de production :

```bash
npm run build && npm start
```

### Accès au back-office

Rendez-vous sur **`/admin`** (redirige vers `/admin/login`).
Comptes de démonstration (mot de passe : **`demo`**) :

| Rôle | Email |
| --- | --- |
| Super Admin | `superadmin@labella.fr` |
| Gérant | `manager@labella.fr` |
| Cuisine | `cuisine@labella.fr` |
| Livreur | `livreur@labella.fr` |
| Support | `support@labella.fr` |

> Chaque rôle voit une navigation filtrée et n'accède qu'aux modules autorisés
> (essayez de vous connecter en *Livreur* puis d'ouvrir « Utilisateurs »).

---

## 🧱 Stack & architecture

- **Next.js 14** (App Router, Server Components, Server Actions, Route Handlers)
- **TypeScript** strict
- **Tailwind CSS** + design system maison (palette chaleureuse italienne)
- **lucide-react** pour l'iconographie
- **Prisma + PostgreSQL** (schéma complet prêt à brancher)
- Authentification par **session signée HMAC** (cookie httpOnly) + middleware

```
app/
├─ (site)/                 # Site public (header/footer)
│  ├─ page.tsx             # Accueil
│  ├─ notre-carte/ nos-pizzas/ menus/ a-propos/ contact/ commander/
│  └─ mentions-legales/ politique-de-confidentialite/
├─ admin/
│  ├─ login/               # Connexion (publique)
│  └─ (dashboard)/         # Espace protégé (sidebar + topbar)
│     ├─ page.tsx          # Dashboard
│     └─ commandes/ cuisine/ produits/ clients/ … (24 modules)
└─ api/
   ├─ admin/…              # Routes API sécurisées (auth + rôle)
   └─ contact/             # Formulaire public

components/         # UI publique + admin (components/admin/*)
sections/           # Sections de la page d'accueil
data/               # Données mockées (site + data/admin/* pour le CRM)
lib/                # Types, utils, auth, nav, format, status
prisma/             # schema.prisma (tous les modèles) + seed.ts
public/images/      # Placeholders SVG (à remplacer par de vraies photos)
```

---

## 🖥️ Site public

Pages : **Accueil, Notre carte, Nos pizzas, Menus, À propos, Contact, Commander**
+ mentions légales / confidentialité + page 404.

Points clés : hero immersive, carrousel de pizzas, sections qualité &
livraison, avis clients, formulaire de contact + carte OpenStreetMap, design
**100 % responsive**, animations au scroll, SEO (metadata, Open Graph), bonnes
pratiques d'accessibilité.

---

## 🧑‍🍳 Back-office / CRM — 24 modules

**Pilotage** : Dashboard (KPIs + graphiques), Vue cuisine (board temps réel).
**Ventes** : Commandes (liste + détail + statuts), Réservations, Livraisons, Paiements (+ export CSV).
**Catalogue** : Produits (disponibilité), Menus, Catégories, Options/suppléments, Stocks.
**Relation client** : Clients (fiche + historique), Avis (modération), Fidélité, Marketing.
**Contenu** : Site web (éditeur de blocs), Médiathèque.
**Système** : Notifications, Assistant IA, Rapports, Utilisateurs & permissions, Paramètres, Logs.

Tous les modules disposent de : navigation filtrée par rôle, contrôle d'accès,
filtres/recherche, badges de statut colorés et une UI responsive cohérente.

### Couche de données

Le CRM tourne aujourd'hui sur une **couche mockée déterministe**
(`data/admin/*`, PRNG à graine fixe → pas de décalage d'hydratation) qui
**reproduit fidèlement les modèles Prisma**. Brancher la vraie base se résume à
remplacer ces imports par des requêtes Prisma — **l'UI reste inchangée**.

**Patron de migration mock → Prisma (fonction-source par module).**
Chaque domaine expose un `getAdminXxx()` qui lit Prisma quand la persistance est
active (`PERSIST_ORDERS` + `DATABASE_URL`), sinon — ou si la base est injoignable
— **retombe sur les mocks** (badge « Données en base » vs « Données démo »).
Aucune page ne casse jamais.

Déjà branchés en live :
- **Commandes** (liste + détail) · **Cuisine** · **Livraisons** → `data/admin/orders-source.ts`
- **Clients** (liste + détail + historique) → `data/admin/customers-source.ts`
- **Réservations** → `data/admin/reservations-source.ts`
- **Paiements** → réutilise `getAdminOrders()`
- **Dashboard** → `computeAnalytics(orders, customers, reservations, now)` sur les vraies données

**Statuts persistants.** Sur le détail commande, changer le statut appelle une
**server action** (`updateOrderStatus`) qui écrit en base + trace une entrée de
**journal d'activité** (`ActivityLog`) quand la persistance est active ; en démo,
l'UI reste optimiste sans écrire.

Les modules restants (Produits, Avis, Stocks, Marketing…) suivront la même recette.

---

## 🗄️ Base de données (Prisma)

Le schéma complet (`prisma/schema.prisma`) couvre **30+ modèles** : User, Role,
Permission, Customer, Address, Order, OrderItem, Product, Category, OptionGroup,
Menu, Reservation, DeliveryZone, DeliveryDriver, Payment, PromoCode,
LoyaltyAccount, Review, Campaign, MediaFile, RestaurantSetting, OpeningHour,
StockItem, Notification, AiConversation, ActivityLog, etc.

```bash
# 1) Renseigner DATABASE_URL dans .env (cf. .env.example)
npm run db:migrate     # crée les tables
npm run db:seed        # données de démonstration
npm run db:studio      # explorer la base
```

---

## 💳 Tunnel de commande & paiement (Stripe)

Parcours client sur **`/commander`** : ajout au panier → choix du mode
(livraison / à emporter / sur place) → **choix du paiement** :

- **En ligne (CB)** → `POST /api/checkout` crée une **Stripe Checkout Session**
  et redirige vers la page de paiement, puis vers
  `/commander/confirmation`.
- **Sur place / à la livraison** → `POST /api/orders` (paiement à la remise).

**Sécurité** : les prix ne viennent **jamais** du client. `lib/orders.ts`
revalide chaque article contre le catalogue serveur et **recalcule tous les
totaux** (testé : un prix forgé est ignoré). Les routes publiques sont
**rate-limitées** par IP (`lib/rate-limit.ts`). Le webhook
`/api/stripe/webhook` **vérifie la signature** et ne traite que les paiements
réellement `paid`.

### Mode démo (sans clés)
Sans `STRIPE_SECRET_KEY`, le tunnel simule un paiement réussi (confirmation
cosmétique, aucune carte débitée) — pratique pour tester en local.

### Activer le paiement réel
```bash
# .env  (clés de test : dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY="sk_test_…"
STRIPE_WEBHOOK_SECRET="whsec_…"
NEXT_PUBLIC_SITE_URL="https://votre-domaine.fr"   # URLs absolues Stripe

# Webhook en local :
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
Carte de test : `4242 4242 4242 4242`, date future, CVC quelconque.

### Persistance & email (câblés, dégradation propre)
La commande est **persistée** (Prisma) et l'**email de confirmation** (Resend)
est envoyé — le tout via une couche qui **dégrade proprement** :

- `POST /api/checkout` crée la commande *en attente de paiement*.
- Le **webhook** la passe à *payée* — avec **idempotence** (`event.id` stocké
  dans `ProcessedWebhookEvent`, rejeux Stripe ignorés) — et envoie l'email.
- `POST /api/orders` (sur place) persiste + envoie l'email.

Activation : `PERSIST_ORDERS="true"` + `DATABASE_URL` (sinon journalisé) et
`RESEND_API_KEY` pour l'email (sinon journalisé). **Sans ces variables, le site
tourne sans PostgreSQL** ; un échec DB/email est attrapé et **ne casse jamais**
la commande (testé : commande OK même DB injoignable).

### Durcissements restants avant prod *(non bloquants)*
- Rate-limit **distribué** (Upstash/Vercel KV) si déploiement multi-instance
  (l'actuel est en mémoire, par instance).
- Notifications **SMS** (Twilio) + ticket cuisine en temps réel.
- Réconciliation des commandes « en attente » jamais payées (expiration).

---

## ✅ État : fonctionnel vs à brancher

**Fonctionnel maintenant (sur données mockées)**
- Site public complet et responsive
- Auth back-office (session signée, middleware, 5 rôles, contrôle d'accès)
- Dashboard, graphiques, tous les modules navigables avec données réalistes
- Interactions UI : filtres, recherche, toggles, board cuisine, modération avis,
  contrôles de statut commande, export CSV des paiements, assistant IA (démo)
- Schéma Prisma complet **validé** + seed + routes API sécurisées (exemples)
- **Tunnel de commande complet** (panier → checkout → confirmation) avec
  **Stripe** câblé (mode démo sans clés, paiement réel avec clés)

**À connecter pour la production** *(infra non disponible dans cette démo)*
- PostgreSQL réel (remplacer `data/admin/*` par Prisma) + persistance des commandes
- Hachage des mots de passe (bcrypt) + persistance des sessions
- Clés **Stripe** réelles + webhook persistant, emails **Resend/SMTP**, SMS **Twilio**
- Upload médias (S3/Cloudinary), assistant IA via l'API **Anthropic**

Variables d'environnement : voir **`.env.example`**.

---

## 🎨 Visuels

Les images de `public/images/` sont des **placeholders SVG de marque**, générés
pour que le site soit présentable immédiatement. Remplacez-les par les vraies
photos du restaurant (mêmes chemins) pour la mise en production.

---

## 📜 Scripts

| Script | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` / `start` | Build & serveur de production |
| `npm run typecheck` | Vérification TypeScript |
| `npm run lint` | ESLint |
| `npm run db:migrate` / `db:seed` / `db:studio` | Prisma |
