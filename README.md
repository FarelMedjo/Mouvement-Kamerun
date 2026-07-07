# Mouvement Kamerun — Site officiel

Plateforme web du parti politique **Mouvement Kamerun** : espace public de présentation,
adhésion et collecte, plus des espaces sécurisés pour les **membres**, les **scrutateurs**,
les **bénévoles** et les **administrateurs**.

Interface **bilingue français / anglais** (bascule de langue côté client), responsive
(mobile + ordinateur), pensée pour les connexions à faible débit.

---

## Pile technique

| Couche | Choix |
|---|---|
| Front-end | React 18 + Vite 5 |
| Styles | Tailwind CSS 3 (palette nationale en tokens) |
| Routeur | React Router 6 |
| Back-end | Supabase (Auth + PostgreSQL + Storage privé) |
| Client | `@supabase/supabase-js` v2 |
| i18n | Contexte maison `src/i18n/LanguageContext.jsx` (FR / EN) |

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
│   ├── content.js       # contenus publics + soumissions (newsletter)
│   ├── scrutateur.js    # détails, téléversement bucket privé, historique, URLs signées
│   ├── benevole.js      # détails bénévole, activation bénévole -> scrutateur
│   ├── membre.js        # détails membre (zone)
│   ├── admin.js         # lectures/écritures réservées admin
│   └── dates.js         # formats de date FR
├── auth/
│   └── AuthContext.jsx  # session + rôles RÉELS (lus dans user_roles via RLS)
├── i18n/
│   └── LanguageContext.jsx  # langue courante + traductions FR/EN
├── components/
│   ├── layout/          # Header, Footer, UtilityBar, Layout, Logo
│   ├── auth/            # AuthShell, Field, SubmitButton, Alert
│   ├── public/          # PageBanner, NewsletterForm, cartes actualité/événement…
│   ├── routing/         # ProtectedRoute (garde par rôle), EspaceRedirect
│   └── ui/              # Spinner
├── pages/
│   ├── public/          # Accueil (avec médiathèque hymne + messages vidéo), APropos,
│   │                    #   Programme, NosCandidats, Actualites, ArticleActualite,
│   │                    #   Evenements, Ressources, FaireDon, Adhesion, Contact
│   ├── auth/            # Connexion, Inscription, mot de passe oublié / réinit.
│   ├── scrutateurs/     # EspaceScrutateurs (présentation+inscription), Dashboard
│   ├── benevoles/       # EspaceBenevoles
│   └── espace/          # BenevoleDashboard, MembreDashboard, AdminDashboard + admin/*Panel
│                        #   (Aperçu, Fichiers, Comptes, Affiliations, Contenus, Newsletter ;
│                        #    Contenus → Actualités/Événements/Vidéos/Programme/Candidats/Documents)
├── config/site.js       # navigation, contacts, réseaux
├── App.jsx              # routeur
└── main.jsx             # montage + AuthProvider
```

### Matrice des rôles

| Action / Ressource | Visiteur | Membre | Scrutateur | Bénévole | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| Pages publiques, don, adhésion | ✅ | ✅ | ✅ | ✅ | ✅ |
| Espace personnel sécurisé | ❌ | ✅ | ✅ | ✅ | ✅ |
| Téléverser des fichiers | ❌ | ❌ | ✅ | Partiel¹ | ✅ |
| Voir ses propres téléversements | ❌ | ❌ | ✅ | Partiel¹ | ✅ |
| Voir les fichiers de **tous** | ❌ | ❌ | ❌ | ❌ | ✅ |
| Gérer comptes / affiliations / contenus | ❌ | ❌ | ❌ | ❌ | ✅ |

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

Tables principales (RLS active sur toutes) : `profiles`, `user_roles`, `scrutateur_details`,
`benevole_details`, `membre_details`, `fichiers`, `affiliations`, `newsletter`, et les contenus éditoriaux
`actualites`, `evenements`, `messages_video`, `programme_themes`, `candidats`, `ressources`. Les contenus
éditoriaux ne sont visibles du public que si `publie = true` ; l'écriture est réservée à
l'admin et se gère depuis l'onglet **Contenus** de l'espace administrateur.

Pour l'appliquer : Dashboard Supabase → SQL Editor → coller le script → Run (en une fois,
sur une base vierge).

**Base existante — migration Espace Membres** : pour ajouter le rôle `membre` et la table
`membre_details` à une base déjà en place, exécuter `scripts/migration-espace-membres.sql`
**en deux temps** (étape 1 seule, puis étape 2 — PostgreSQL interdit d'utiliser une nouvelle
valeur d'enum dans la transaction qui l'ajoute ; détails en en-tête du fichier).

**Base existante — migration Nos candidats** : pour ajouter la table `candidats` (page
« Nos candidats ») à une base déjà en place, exécuter `scripts/migration-nos-candidats.sql`
**en une seule fois** (elle amorce le candidat à la présidentielle, Jacques Bougha).

Premier administrateur (manuel) :

```sql
insert into public.user_roles (user_id, role)
values ('<UUID_DE_L_UTILISATEUR>', 'admin');
```

Le rôle `admin` n'est **jamais** attribuable depuis le site : il se pose manuellement en SQL
(ou par insertion directe en base avec, pour un compte créé à la main, les colonnes de jetons
GoTrue initialisées à `''`).

---

## Comptes

### Administrateur

| E-mail | Rôle |
|---|---|
| `mouvementkamerun@gmail.com` | admin (seul administrateur) |

> ⚠️ Ce compte utilise pour l'instant le mot de passe commun `Test1234!`. **À changer** :
> c'est le seul accès administrateur du site.

### Comptes de test

Mot de passe commun : `Test1234!`

| E-mail | Rôle |
|---|---|
| `mk.scrutateur1.test@gmail.com` | scrutateur (BV 042) |
| `mk.scrutateur2.test@gmail.com` | scrutateur (BV 100) |
| `mk.benevole1.test@gmail.com` | bénévole |
| `mk.benevole2.test@gmail.com` | bénévole (a déclaré le secteur « scrutateur ») |
| `mk.membre1.test@gmail.com` | membre (zone Yaoundé, Centre) |

Suppression : `delete from auth.users where email like 'mk.%.test@gmail.com';`

---

## État d'avancement

- [x] Socle (projet, connexion Supabase, layout commun)
- [x] Authentification & rôles (inscription, connexion, réinitialisation, gardes de routes)
- [x] Espace public (accueil, pages, don, adhésion, newsletter — contenus depuis la base)
- [x] Espace Membres (adhésion = création de compte, tableau de bord, profil/zone)
- [x] Espace Scrutateurs (inscription, tableau de bord, téléversement privé, historique)
- [x] Espace Bénévoles (inscription, secteurs, activation scrutateur)
- [x] Espace Administrateur (réception fichiers, comptes, affiliations, contenus, newsletter)
- [x] Gestion des contenus éditoriaux (actualités + page article, événements, vidéos, programme, candidats, documents)
- [x] Page « Nos candidats » (présidentielle / législatives / municipales, gérée par l'admin)
- [x] Médiathèque d'accueil (hymne + messages vidéo YouTube)
- [x] Internationalisation FR / EN (bascule de langue)
- [ ] Durcissement (anti-robots renforcé, journalisation, validations, paiement des dons)
