# CLAUDE.md — Guide pour agents IA

Instructions de travail pour ce dépôt (site **Mouvement Kamerun**). À lire avant toute
modification. Voir `README.md` pour la présentation générale et le démarrage.

## Commandes

```bash
npm run dev      # serveur de dev — http://localhost:5173
npm run build    # build de production (valider la compilation avant de livrer)
npm run preview  # prévisualiser le build
```

Après une modification, **vérifier que `npm run build` passe** avant de conclure.

## Pile & conventions

- **React 18 + Vite + Tailwind CSS 3**, JavaScript (`.jsx`), pas de TypeScript.
- **Interface en français** : tout texte visible, commentaire et nom de variable métier en
  français.
- **Styles** : Tailwind. La palette est en tokens (`kgreen`, `kred`, `kgold`, `knavy`,
  `klight`, plus `kink`, `kmuted`, `kfaint`, `kline`) dans `tailwind.config.js`. Les
  maquettes utilisent des valeurs précises → on emploie largement les **valeurs arbitraires**
  Tailwind (`text-[15px]`, `py-[clamp(40px,6vw,72px)]`, etc.) pour rester fidèle au design.
- **Fidélité aux maquettes** : les écrans reproduisent le bundle Claude Design (HTML/CSS).
  Reproduire le rendu, pas la structure interne du prototype.
- ⚠️ **Classes Tailwind dynamiques** (ex. `` `text-${accent}` ``) : le littéral complet doit
  exister quelque part dans le code, sinon le purge CSS le supprime. Préférer des tables de
  correspondance avec classes littérales (voir `EvenementItem.jsx`, `Programme.jsx`).

## Architecture

- `src/lib/supabase.js` : client unique, lit `import.meta.env.VITE_SUPABASE_*`. Jamais de
  clé en dur.
- `src/auth/AuthContext.jsx` : source de vérité de la session et des **rôles réels** (relus
  dans `user_roles` via RLS). L'UI ne fabrique jamais un rôle.
- `src/lib/*.js` : accès aux données par domaine (`content`, `scrutateur`, `benevole`,
  `admin`). Mettre la logique Supabase ici, pas dans les composants.
- `src/components/routing/ProtectedRoute.jsx` : garde de route par rôle (confort UX) — la
  barrière réelle reste la RLS.

## Invariants de sécurité — NE PAS enfreindre

1. **Contrôle d'accès côté serveur (RLS)**. Une garde de route ou un bouton masqué ne sont
   que cosmétiques ; ne jamais s'y fier comme seule protection.
2. **Le rôle `admin` n'est jamais attribuable depuis le site.** Ne pas l'ajouter aux rôles
   auto-attribuables (`ROLES_AUTO_ATTRIBUABLES` = scrutateur, bénévole uniquement).
3. **Fichiers scrutateurs** : bucket privé `documents-electoraux`, chemin
   `<user_id>/<fichier>`. Téléchargement uniquement par **URL signée** temporaire, jamais
   d'URL publique. Ne pas affaiblir les politiques Storage.
4. **`schema_supabase_mouvement_kamerun.sql` fait autorité.** Ne pas le contredire. Toute
   évolution de schéma doit être proposée et validée par l'utilisateur avant application.

## À demander avant d'agir

- Toute **action sensible ou irréversible** côté base/production (attribution de rôle,
  surtout `admin` ; suppression de données réelles ; changement de schéma).
- Désigner un administrateur : se fait **manuellement en SQL**, jamais via l'application.
- Brancher un prestataire de paiement (la page « Faire un don » est présentationnelle).

## Supabase

- Projet de référence : `tiddvyzhbfrzlapfdems` (région à confirmer côté dashboard).
- Tables : `profiles`, `user_roles`, `scrutateur_details`, `benevole_details`, `fichiers`,
  `affiliations`, `newsletter`, `actualites`, `evenements`. RLS active sur toutes.
- Fonctions clés : `public.has_role(uid, role)`, `public.is_admin()` (SECURITY DEFINER) ;
  trigger `on_auth_user_created` → crée le profil depuis `raw_user_meta_data`.
- Contenus publics : `actualites` / `evenements` ne renvoient au public que `publie = true`.

## Cas particuliers connus

- **Confirmation d'e-mail** : si activée dans Supabase, aucune session n'existe juste après
  `signUp`. Le rôle et les détails (scrutateur/bénévole) sont mémorisés dans les métadonnées
  et insérés à la **première session** (`AuthContext` : `ensure…FromMetadata`). Idempotent.
- **Création de comptes de test** : `signUp` via l'API rejette certains domaines
  (`@example.com`). Pour des comptes de test confirmés, l'insertion directe en base exige
  d'initialiser les colonnes de jetons GoTrue à `''` (`confirmation_token`, `recovery_token`,
  `email_change*`, `phone_change*`, `reauthentication_token`), sinon la connexion renvoie 500.
- **Suppression Storage** : interdite en SQL direct (`protect_delete`) et réservée à l'admin
  par la policy ; passer par l'API Storage avec un compte admin.

## Comptes de test

Voir `README.md`. Mot de passe : `Test1234!`. UUID repérables : `3333…` scrutateurs,
`4444…` bénévoles.
