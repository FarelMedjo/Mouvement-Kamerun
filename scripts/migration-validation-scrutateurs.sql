-- ============================================================================
-- MIGRATION : validation des scrutateurs par l'admin
-- ============================================================================
-- Problème corrigé : la policy d'auto-inscription de user_roles laisse tout
-- compte authentifié s'attribuer 'scrutateur' directement par l'API, et les
-- policies de dépôt (table fichiers + bucket documents-electoraux) ne
-- vérifiaient que la présence du rôle. N'importe qui pouvait donc injecter de
-- faux PV / photos / vidéos dans la réception de l'admin.
--
-- Correctif :
--   1. Colonne user_roles.valide (false par défaut). Seul l'admin peut la
--      passer à true (aucune policy UPDATE pour l'utilisateur lui-même).
--   2. L'auto-inscription reste possible, mais un rôle 'scrutateur' auto-
--      attribué est OBLIGATOIREMENT créé avec valide = false.
--   3. Le dépôt de fichiers (table + Storage) exige un scrutateur VALIDÉ.
--
-- La colonne n'a d'effet que pour le rôle 'scrutateur' ; pour bénévole /
-- membre elle est ignorée.
--
-- Exécutable en une fois (SQL Editor Supabase).
-- ============================================================================

-- 1. Colonne de statut -------------------------------------------------------
--    Ajoutée avec DEFAULT true pour ne pas bloquer les comptes EXISTANTS
--    (repris tels quels), puis le défaut passe à false pour les nouveaux.
--    ⚠️ Si des comptes scrutateurs suspects existent déjà, les repasser en
--    attente après la migration :
--      update public.user_roles set valide = false where role = 'scrutateur';
alter table public.user_roles
  add column if not exists valide boolean not null default true;

alter table public.user_roles
  alter column valide set default false;

-- 2. Fonction de contrôle ----------------------------------------------------
create or replace function public.est_scrutateur_valide(_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = 'scrutateur' and valide
  );
$$;

-- 3. Auto-inscription : un scrutateur s'inscrit TOUJOURS « en attente » ------
drop policy if exists "Rôles : auto-inscription scrutateur/benevole/membre" on public.user_roles;

create policy "Rôles : auto-inscription scrutateur/benevole/membre"
  on public.user_roles for insert to authenticated
  with check (
    user_id = auth.uid()
    and role in ('scrutateur', 'benevole', 'membre')
    and (role <> 'scrutateur' or valide = false)
  );

-- 4. Dépôt de fichiers réservé aux scrutateurs VALIDÉS -----------------------
drop policy if exists "Fichiers : téléversement par un scrutateur" on public.fichiers;

create policy "Fichiers : téléversement par un scrutateur"
  on public.fichiers for insert to authenticated
  with check (
    scrutateur_id = auth.uid()
    and public.est_scrutateur_valide(auth.uid())
  );

drop policy if exists "Storage : dépôt par un scrutateur dans son dossier" on storage.objects;

create policy "Storage : dépôt par un scrutateur dans son dossier"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'documents-electoraux'
    and (storage.foldername(name))[1] = auth.uid()::text
    and public.est_scrutateur_valide(auth.uid())
  );

-- ============================================================================
-- FIN DE LA MIGRATION
-- ============================================================================
