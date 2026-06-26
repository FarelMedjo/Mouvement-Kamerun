# Mouvement Kamerun — Site officiel

Plateforme web du parti politique **Mouvement Kamerun** : espace public de présentation,
adhésion et collecte, plus des espaces sécurisés pour les **scrutateurs**, les **bénévoles**
et les **administrateurs**.

Interface en **français**, responsive (mobile + ordinateur), pensée pour les connexions à
faible débit.

---

## Pile technique

| Couche | Choix |
|---|---|
| Front-end | React 18 + Vite 5 |
| Styles | Tailwind CSS 3 (palette nationale en tokens) |
| Routeur | React Router 6 |
| Back-end | Supabase (Auth + PostgreSQL + Storage privé) |
| Client | `@supabase/supabase-js` v2 |

### Palette (couleurs nationales du Cameroun)

| Token Tailwind | Hex | Usage |
|---|---|---|
| `kgreen` | `#0B6B43` | Navigation, actions principales |
| `kred` | `#CE1126` | Accents, actions secondaires |
| `kgold` | `#FCD116` | Touches, soulignages |
| `knavy` | `#11203F` | Grands titres, barres |
| `klight` | `#F4F6F9` | Fonds |

Polices : **Barlow Condensed** (titres) et **Source Sans 3** (texte).

---

## Démarrage

### Prérequis
- Node.js ≥ 18
- Un projet Supabase avec le schéma appliqué (voir `schema_supabase_mouvement_kamerun.sql`)

### Installation

```bash
npm install
cp .env.example .env.local   # puis renseigner les valeurs
npm run dev                  # http://localhost:5173
```

### Variables d'environnement (`.env.local`)

```
VITE_SUPABASE_URL=https://<projet>.supabase.co
VITE_SUPABASE_ANON_KEY=<clé anon / publishable>
```

> Seule la clé **anon** (publique) est utilisée côté front. La clé `service_role`
> ne doit **jamais** figurer dans ce dépôt. `.env.local` est ignoré par git.

### Scripts

| Commande | Effet |
|---|---|
| `npm run dev` | Serveur de développement (port 5173) |
| `npm run build` | Build de production dans `dist/` |
| `npm run preview` | Prévisualisation du build |

---

## Architecture

```
src/
├── lib/
│   ├── supabase.js      # client supabase-js (lit les variables VITE_)
│   ├── content.js       # contenus publics + soumissions (affiliation, newsletter)
│   ├── scrutateur.js    # détails, téléversement bucket privé, historique, URLs signées
│   ├── benevole.js      # détails bénévole, activation bénévole -> scrutateur
│   ├── admin.js         # lectures/écritures réservées admin
│   └── dates.js         # formats de date FR
├── auth/
│   └── AuthContext.jsx  # session + rôles RÉELS (lus dans user_roles via RLS)
├── components/
│   ├── layout/          # Header, Footer, UtilityBar, Layout, Logo
│   ├── auth/            # AuthShell, Field, SubmitButton, Alert
│   ├── public/          # PageBanner, NewsletterForm, cartes actualité/événement…
│   ├── routing/         # ProtectedRoute (garde par rôle), EspaceRedirect
│   └── ui/              # Spinner
├── pages/
│   ├── public/          # Accueil, APropos, Programme, Actualites, Evenements,
│   │                    #   Ressources, FaireDon, Adhesion, Contact
│   ├── auth/            # Connexion, Inscription, mot de passe oublié / réinit.
│   ├── scrutateurs/     # EspaceScrutateurs (présentation+inscription), Dashboard
│   ├── benevoles/       # EspaceBenevoles
│   └── espace/          # BenevoleDashboard, AdminDashboard + admin/*Panel
├── config/site.js       # navigation, contacts, réseaux
├── App.jsx              # routeur
└── main.jsx             # montage + AuthProvider
```

### Matrice des rôles

| Action / Ressource | Visiteur | Scrutateur | Bénévole | Admin |
|---|:---:|:---:|:---:|:---:|
| Pages publiques, don, affiliation | ✅ | ✅ | ✅ | ✅ |
| Espace personnel sécurisé | ❌ | ✅ | ✅ | ✅ |
| Téléverser des fichiers | ❌ | ✅ | Partiel¹ | ✅ |
| Voir ses propres téléversements | ❌ | ✅ | Partiel¹ | ✅ |
| Voir les fichiers de **tous** | ❌ | ❌ | ❌ | ✅ |
| Gérer comptes / affiliations / contenus | ❌ | ❌ | ❌ | ✅ |

¹ Un bénévole n'a aucun droit de téléversement par défaut. Il l'obtient s'il déclare le
secteur « scrutateur » et active le compte scrutateur correspondant (il agit alors avec
les droits du profil scrutateur).

---

## Sécurité — invariants

1. **Le contrôle d'accès est appliqué côté serveur (RLS PostgreSQL)**, jamais seulement
   par masquage d'éléments d'interface. Masquer un bouton n'est qu'un confort visuel.
2. **Fichiers des scrutateurs** : stockés dans le bucket **privé** `documents-electoraux`,
   chemin `<user_id>/<fichier>`. Accessibles uniquement au scrutateur propriétaire et aux
   administrateurs. Aucune URL publique — tout téléchargement passe par une **URL signée**
   temporaire.
3. **Le rôle `admin` n'est jamais attribuable depuis le site.** Il se crée manuellement en
   SQL (voir la section finale de `schema_supabase_mouvement_kamerun.sql`).

L'isolation entre scrutateurs (table `fichiers` + Storage) a été vérifiée en base : un
scrutateur ne peut ni lister, ni télécharger, ni écrire les fichiers d'un autre.

---

## Base de données

Le fichier `schema_supabase_mouvement_kamerun.sql` **fait autorité**. Il définit les tables,
les types, les fonctions `SECURITY DEFINER` (`has_role`, `is_admin`), le trigger de création
de profil, le bucket privé et **toutes les politiques RLS**.

Pour l'appliquer : Dashboard Supabase → SQL Editor → coller le script → Run (en une fois,
sur une base vierge).

Premier administrateur (manuel) :

```sql
insert into public.user_roles (user_id, role)
values ('<UUID_DE_L_UTILISATEUR>', 'admin');
```

---

## Comptes de test

Mot de passe commun : `Test1234!`

| E-mail | Rôle |
|---|---|
| `mk.scrutateur1.test@gmail.com` | scrutateur (BV 042) |
| `mk.scrutateur2.test@gmail.com` | scrutateur (BV 100) |
| `mk.benevole1.test@gmail.com` | bénévole |
| `mk.benevole2.test@gmail.com` | bénévole (a déclaré le secteur « scrutateur ») |

Suppression : `delete from auth.users where email like 'mk.%.test@gmail.com';`

---

## État d'avancement

- [x] Socle (projet, connexion Supabase, layout commun)
- [x] Authentification & rôles (inscription, connexion, réinitialisation, gardes de routes)
- [x] Espace public (accueil, pages, don, affiliation, newsletter — contenus depuis la base)
- [x] Espace Scrutateurs (inscription, tableau de bord, téléversement privé, historique)
- [x] Espace Bénévoles (inscription, secteurs, activation scrutateur)
- [x] Espace Administrateur (réception fichiers, comptes, affiliations, contenus, newsletter)
- [ ] Durcissement (anti-robots renforcé, journalisation, validations, paiement des dons)
