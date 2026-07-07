-- ============================================================================
--  MOUVEMENT KAMERUN — Migration : NOS CANDIDATS
--  Objet : ajoute la table `candidats` (candidats soutenus par le mouvement aux
--          élections présidentielle, législatives et municipales) et ses
--          politiques RLS, sur le MÊME modèle que `programme_themes` :
--            · lecture publique des seules lignes publiées ;
--            · gestion (création / modification / suppression) réservée à l'admin.
--          À appliquer sur une base contenant déjà le schéma de référence
--          (schema_supabase_mouvement_kamerun.sql).
--
--  Ce fichier peut être exécuté EN UNE SEULE FOIS (aucune valeur d'enum n'est
--  ajoutée, contrairement à la migration de l'espace membres).
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. Table des candidats
--    Un candidat = un nom, un type d'élection, et (optionnellement) sa
--    circonscription, une courte biographie bilingue et une photo.
-- ----------------------------------------------------------------------------
create table if not exists public.candidats (
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

alter table public.candidats enable row level security;


-- ----------------------------------------------------------------------------
-- 2. Politiques RLS (identiques au patron des contenus publics)
-- ----------------------------------------------------------------------------

-- Lecture publique des candidats publiés (visiteurs anonymes + connectés) ;
-- l'admin voit aussi les brouillons.
create policy "Candidats : lecture publique des publiés"
  on public.candidats for select
  using (publie or public.is_admin());

-- Création, modification et suppression réservées à l'admin.
create policy "Candidats : gestion réservée à l'admin"
  on public.candidats for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());


-- ----------------------------------------------------------------------------
-- 3. Amorçage : candidat à l'élection présidentielle
--    Les listes législatives et municipales restent vides pour l'instant ;
--    elles seront renseignées par l'admin depuis « Contenus → Candidats ».
-- ----------------------------------------------------------------------------
insert into public.candidats (nom, type_election, ordre, publie)
values ('Jacques Bougha', 'presidentielle', 1, true);

-- ============================================================================
-- FIN DE LA MIGRATION
-- ============================================================================
