-- ============================================================================
--  MOUVEMENT KAMERUN — Schéma de base de données Supabase (PostgreSQL)
--  Auteur : MVONGO MEDJO ORDI FAREL
--  Objet  : Tables, rôles, fonctions et politiques de sécurité (RLS)
--           conformes à la matrice des rôles du cahier des charges.
--
--  ORDRE D'EXÉCUTION : exécuter ce script en une fois dans l'éditeur SQL
--  de Supabase, ou le fournir à Claude Code comme migration de référence.
--
--  PRINCIPE DE SÉCURITÉ CENTRAL :
--    - Les rôles sont stockés dans une table dédiée (public.user_roles),
--      JAMAIS dans le profil modifiable par l'utilisateur.
--    - Le contrôle d'accès est appliqué au niveau de la BASE (RLS), pas
--      seulement dans l'interface. Une faille côté interface ne suffit donc
--      pas à contourner les règles.
--    - Le rôle 'admin' n'est JAMAIS auto-attribuable : il se crée à la main
--      (voir la section finale).
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. TYPE ÉNUMÉRÉ DES RÔLES
-- ----------------------------------------------------------------------------
create type public.app_role as enum ('scrutateur', 'benevole', 'membre', 'admin');

-- Secteurs déclarés par les bénévoles
create type public.secteur_benevole as enum
  ('scrutateur', 'graphiste', 'communicateur', 'logistique', 'mobilisation', 'autre');

-- Nature des fichiers transmis par les scrutateurs
create type public.type_fichier as enum ('pv', 'image', 'audio', 'video', 'autre');

-- Statut d'une demande d'affiliation
create type public.statut_affiliation as enum ('en_attente', 'validee', 'rejetee');


-- ----------------------------------------------------------------------------
-- 2. TABLES
-- ----------------------------------------------------------------------------

-- 2.1 Profils (extension de auth.users) ------------------------------------
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  nom_complet text,
  telephone   text,
  created_at  timestamptz not null default now()
);

-- 2.2 Rôles des utilisateurs (table sensible, séparée du profil) -----------
create table public.user_roles (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

-- 2.3 Détails spécifiques aux scrutateurs ----------------------------------
create table public.scrutateur_details (
  user_id        uuid primary key references auth.users(id) on delete cascade,
  region         text,
  departement    text,
  arrondissement text,
  bureau_vote    text,
  created_at     timestamptz not null default now()
);

-- 2.4 Détails spécifiques aux bénévoles ------------------------------------
create table public.benevole_details (
  user_id       uuid primary key references auth.users(id) on delete cascade,
  zone          text,
  disponibilites text,
  secteurs      public.secteur_benevole[] not null default '{}',
  created_at    timestamptz not null default now()
);

-- 2.4bis Détails spécifiques aux membres -----------------------------------
create table public.membre_details (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  zone       text,
  created_at timestamptz not null default now()
);

-- 2.5 Fichiers transmis par les scrutateurs --------------------------------
--     Le fichier binaire est dans le Storage privé ; cette table n'en
--     contient que les métadonnées et le chemin.
create table public.fichiers (
  id            uuid primary key default gen_random_uuid(),
  scrutateur_id uuid not null references auth.users(id) on delete cascade,
  bureau_vote   text,
  type          public.type_fichier not null default 'autre',
  storage_path  text not null,           -- chemin dans le bucket privé
  taille_octets bigint,
  created_at    timestamptz not null default now()
);

-- 2.6 Demandes d'affiliation (soumissibles par le public) ------------------
create table public.affiliations (
  id         uuid primary key default gen_random_uuid(),
  nom        text not null,
  prenom     text,
  telephone  text,
  email      text,
  zone       text,
  statut     public.statut_affiliation not null default 'en_attente',
  created_at timestamptz not null default now()
);

-- 2.7 Newsletter / liste de diffusion (soumissible par le public) ----------
create table public.newsletter (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  nom        text,
  created_at timestamptz not null default now()
);

-- 2.8 Contenus publics : actualités et événements --------------------------
create table public.actualites (
  id          uuid primary key default gen_random_uuid(),
  titre       text not null,
  contenu     text,
  image_url   text,
  publie      boolean not null default false,
  created_at  timestamptz not null default now()
);

create table public.evenements (
  id          uuid primary key default gen_random_uuid(),
  titre       text not null,
  description text,
  lieu        text,
  date_event  timestamptz,
  image_url   text,
  publie      boolean not null default false,
  created_at  timestamptz not null default now()
);

-- 2.9 Messages vidéo YouTube de l'accueil ----------------------------------
--     Vidéos affichées dans la médiathèque de la page d'accueil (versions
--     FR et EN via `youtube_id` / `youtube_id_en`).
create table public.messages_video (
  id            uuid primary key default gen_random_uuid(),
  titre         text not null,
  titre_en      text,
  youtube_id    text not null,
  youtube_id_en text,
  ordre         integer not null default 0,
  publie        boolean not null default false,
  created_at    timestamptz not null default now()
);

-- 2.10 Thèmes du programme -------------------------------------------------
--     Thèmes de la page « Le programme » : couleur d'accent (token de la
--     charte) et liste de points, bilingues.
create table public.programme_themes (
  id         uuid primary key default gen_random_uuid(),
  titre      text not null,
  titre_en   text,
  couleur    text not null default 'kgreen'
               check (couleur in ('kgreen', 'kred', 'kgold', 'knavy')),
  points     text[] not null default '{}',
  points_en  text[] not null default '{}',
  ordre      integer not null default 0,
  publie     boolean not null default false,
  created_at timestamptz not null default now()
);

-- 2.11 Ressources / bibliothèque de documents ------------------------------
--     Documents publics : soit un lien externe (`url`), soit un fichier
--     déposé dans le bucket public `documents-publics` (`storage_path`).
create table public.ressources (
  id           uuid primary key default gen_random_uuid(),
  titre        text not null,
  titre_en     text,
  url          text,
  storage_path text,
  ordre        integer not null default 0,
  publie       boolean not null default false,
  created_at   timestamptz not null default now()
);

-- 2.12 Candidats soutenus par le mouvement ---------------------------------
--     Candidats aux élections présidentielle, législatives et municipales.
--     Page publique « Nos candidats » ; gestion réservée à l'admin.
create table public.candidats (
  id              uuid primary key default gen_random_uuid(),
  nom             text not null,
  type_election   text not null
                    check (type_election in ('presidentielle', 'legislatives', 'municipales')),
  circonscription text,
  bio             text,
  bio_en          text,
  photo_url       text,
  ordre           integer not null default 0,
  publie          boolean not null default false,
  created_at      timestamptz not null default now()
);


-- ----------------------------------------------------------------------------
-- 3. FONCTIONS UTILITAIRES (SECURITY DEFINER)
--    Elles lisent user_roles sans déclencher le RLS, ce qui évite la
--    récursion infinie dans les politiques et centralise la vérification.
-- ----------------------------------------------------------------------------

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role(auth.uid(), 'admin');
$$;

-- Création automatique du profil à l'inscription d'un nouvel utilisateur
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nom_complet, telephone)
  values (
    new.id,
    new.raw_user_meta_data ->> 'nom_complet',
    new.raw_user_meta_data ->> 'telephone'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ----------------------------------------------------------------------------
-- 4. ACTIVATION DU RLS SUR TOUTES LES TABLES
-- ----------------------------------------------------------------------------
alter table public.profiles            enable row level security;
alter table public.user_roles          enable row level security;
alter table public.scrutateur_details  enable row level security;
alter table public.benevole_details    enable row level security;
alter table public.membre_details      enable row level security;
alter table public.fichiers            enable row level security;
alter table public.affiliations        enable row level security;
alter table public.newsletter          enable row level security;
alter table public.actualites          enable row level security;
alter table public.evenements          enable row level security;
alter table public.messages_video      enable row level security;
alter table public.programme_themes    enable row level security;
alter table public.ressources          enable row level security;
alter table public.candidats           enable row level security;


-- ----------------------------------------------------------------------------
-- 5. POLITIQUES RLS (alignées sur la matrice des rôles)
-- ----------------------------------------------------------------------------

-- 5.1 profiles -------------------------------------------------------------
create policy "Profil : lecture par soi-même ou admin"
  on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());

create policy "Profil : mise à jour par soi-même ou admin"
  on public.profiles for update to authenticated
  using (id = auth.uid() or public.is_admin());

-- 5.2 user_roles -----------------------------------------------------------
-- Lecture : ses propres rôles, ou tout pour l'admin.
create policy "Rôles : lecture par soi-même ou admin"
  on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- Auto-inscription : un utilisateur peut s'attribuer UNIQUEMENT
-- 'scrutateur', 'benevole' ou 'membre' pour lui-même. JAMAIS 'admin'.
create policy "Rôles : auto-inscription scrutateur/benevole/membre"
  on public.user_roles for insert to authenticated
  with check (
    user_id = auth.uid()
    and role in ('scrutateur', 'benevole', 'membre')
  );

-- Toute autre gestion des rôles (dont l'attribution d'admin) : admin seul.
create policy "Rôles : gestion par admin"
  on public.user_roles for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 5.3 scrutateur_details ---------------------------------------------------
create policy "Détails scrutateur : lecture par soi-même ou admin"
  on public.scrutateur_details for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy "Détails scrutateur : écriture par soi-même"
  on public.scrutateur_details for insert to authenticated
  with check (user_id = auth.uid());

create policy "Détails scrutateur : mise à jour par soi-même ou admin"
  on public.scrutateur_details for update to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- 5.4 benevole_details -----------------------------------------------------
create policy "Détails bénévole : lecture par soi-même ou admin"
  on public.benevole_details for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy "Détails bénévole : écriture par soi-même"
  on public.benevole_details for insert to authenticated
  with check (user_id = auth.uid());

create policy "Détails bénévole : mise à jour par soi-même ou admin"
  on public.benevole_details for update to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- 5.4bis membre_details ----------------------------------------------------
create policy "Détails membre : lecture par soi-même ou admin"
  on public.membre_details for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy "Détails membre : écriture par soi-même"
  on public.membre_details for insert to authenticated
  with check (user_id = auth.uid());

create policy "Détails membre : mise à jour par soi-même ou admin"
  on public.membre_details for update to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- 5.5 fichiers (LE CŒUR SENSIBLE) -----------------------------------------
-- Téléversement : un scrutateur authentifié, pour LUI-MÊME uniquement.
create policy "Fichiers : téléversement par un scrutateur"
  on public.fichiers for insert to authenticated
  with check (
    scrutateur_id = auth.uid()
    and public.has_role(auth.uid(), 'scrutateur')
  );

-- Lecture : le scrutateur voit SES fichiers ; l'admin voit TOUT.
-- Aucun autre profil n'a accès.
create policy "Fichiers : lecture par le propriétaire ou admin"
  on public.fichiers for select to authenticated
  using (scrutateur_id = auth.uid() or public.is_admin());

-- Suppression : réservée à l'admin (intégrité des preuves).
create policy "Fichiers : suppression par admin"
  on public.fichiers for delete to authenticated
  using (public.is_admin());

-- 5.6 affiliations ---------------------------------------------------------
-- Soumission ouverte au public (visiteurs anonymes et authentifiés).
create policy "Affiliations : soumission publique"
  on public.affiliations for insert to anon, authenticated
  with check (true);

-- Lecture et gestion : admin seul. (Aucune politique SELECT pour le public.)
create policy "Affiliations : lecture par admin"
  on public.affiliations for select to authenticated
  using (public.is_admin());

create policy "Affiliations : mise à jour par admin"
  on public.affiliations for update to authenticated
  using (public.is_admin());

-- 5.7 newsletter -----------------------------------------------------------
create policy "Newsletter : inscription publique"
  on public.newsletter for insert to anon, authenticated
  with check (true);

create policy "Newsletter : lecture par admin"
  on public.newsletter for select to authenticated
  using (public.is_admin());

-- 5.8 actualites -----------------------------------------------------------
-- Lecture publique des contenus publiés ; édition réservée à l'admin.
create policy "Actualités : lecture publique des contenus publiés"
  on public.actualites for select to anon, authenticated
  using (publie = true or public.is_admin());

create policy "Actualités : gestion par admin"
  on public.actualites for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 5.9 evenements -----------------------------------------------------------
create policy "Événements : lecture publique des contenus publiés"
  on public.evenements for select to anon, authenticated
  using (publie = true or public.is_admin());

create policy "Événements : gestion par admin"
  on public.evenements for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 5.10 messages_video ------------------------------------------------------
create policy "Messages vidéo : lecture publique des contenus publiés"
  on public.messages_video for select to anon, authenticated
  using (publie = true or public.is_admin());

create policy "Messages vidéo : gestion par admin"
  on public.messages_video for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 5.11 programme_themes ----------------------------------------------------
create policy "Programme : lecture publique des contenus publiés"
  on public.programme_themes for select to anon, authenticated
  using (publie = true or public.is_admin());

create policy "Programme : gestion par admin"
  on public.programme_themes for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 5.12 ressources ----------------------------------------------------------
create policy "Ressources : lecture publique des contenus publiés"
  on public.ressources for select to anon, authenticated
  using (publie = true or public.is_admin());

create policy "Ressources : gestion par admin"
  on public.ressources for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 5.13 candidats -----------------------------------------------------------
-- Lecture publique des candidats publiés ; gestion réservée à l'admin.
create policy "Candidats : lecture publique des publiés"
  on public.candidats for select to anon, authenticated
  using (publie = true or public.is_admin());

create policy "Candidats : gestion par admin"
  on public.candidats for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());


-- ----------------------------------------------------------------------------
-- 6. STOCKAGE PRIVÉ DES FICHIERS ÉLECTORAUX (Supabase Storage)
--    Bucket NON public. Convention de chemin : <user_id>/<nom_du_fichier>
--    pour pouvoir restreindre chaque scrutateur à son propre dossier.
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('documents-electoraux', 'documents-electoraux', false)
on conflict (id) do nothing;

-- Téléversement : un scrutateur dépose uniquement dans SON dossier.
create policy "Storage : dépôt par un scrutateur dans son dossier"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'documents-electoraux'
    and (storage.foldername(name))[1] = auth.uid()::text
    and public.has_role(auth.uid(), 'scrutateur')
  );

-- Lecture : le scrutateur lit son propre dossier ; l'admin lit tout.
create policy "Storage : lecture par le propriétaire ou admin"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'documents-electoraux'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin()
    )
  );

-- Suppression : admin seul.
create policy "Storage : suppression par admin"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'documents-electoraux'
    and public.is_admin()
  );


-- ----------------------------------------------------------------------------
-- 6bis. STOCKAGE PUBLIC DES DOCUMENTS DE LA BIBLIOTHÈQUE (Supabase Storage)
--       Bucket PUBLIC : lecture ouverte à tous ; dépôt/màj/suppression admin.
--       Utilisé par la table `ressources` (colonne `storage_path`).
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('documents-publics', 'documents-publics', true)
on conflict (id) do nothing;

-- Lecture : publique (bucket public).
create policy "Documents publics : lecture publique"
  on storage.objects for select
  using (bucket_id = 'documents-publics');

-- Dépôt : admin seul.
create policy "Documents publics : dépôt par admin"
  on storage.objects for insert
  with check (bucket_id = 'documents-publics' and public.is_admin());

-- Mise à jour : admin seul.
create policy "Documents publics : mise à jour par admin"
  on storage.objects for update
  using (bucket_id = 'documents-publics' and public.is_admin())
  with check (bucket_id = 'documents-publics' and public.is_admin());

-- Suppression : admin seul.
create policy "Documents publics : suppression par admin"
  on storage.objects for delete
  using (bucket_id = 'documents-publics' and public.is_admin());


-- ============================================================================
-- 7. CRÉATION DU PREMIER ADMINISTRATEUR (À FAIRE MANUELLEMENT)
-- ----------------------------------------------------------------------------
-- Le rôle 'admin' n'est jamais attribuable depuis le site. Pour désigner le
-- premier administrateur :
--   1) Créez d'abord son compte via l'inscription normale (ou le dashboard).
--   2) Récupérez son identifiant (auth.users.id), puis exécutez À LA MAIN,
--      dans l'éditeur SQL de Supabase :
--
--      insert into public.user_roles (user_id, role)
--      values ('COLLER_ICI_L_UUID_DE_L_UTILISATEUR', 'admin');
--
-- Conservez le nombre d'administrateurs au strict minimum.
-- ============================================================================
