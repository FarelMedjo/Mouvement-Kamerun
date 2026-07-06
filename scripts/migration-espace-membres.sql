-- ============================================================================
--  MOUVEMENT KAMERUN — Migration : ESPACE MEMBRES
--  Objet : ajoute le rôle 'membre' (auto-attribuable), la table membre_details
--          et ses politiques RLS. À appliquer sur une base contenant déjà le
--          schéma de référence (schema_supabase_mouvement_kamerun.sql).
--
--  ⚠️ ORDRE D'EXÉCUTION IMPORTANT
--    PostgreSQL interdit d'utiliser une nouvelle valeur d'enum dans la même
--    transaction que son ajout. Exécutez donc l'ÉTAPE 1 SEULE (bouton « Run »),
--    PUIS l'ÉTAPE 2. Ne lancez pas tout le fichier en une seule fois.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- ÉTAPE 1 — Ajouter la valeur 'membre' au type énuméré des rôles.
--           (À exécuter seule, puis passer à l'étape 2.)
-- ----------------------------------------------------------------------------
alter type public.app_role add value if not exists 'membre';


-- ----------------------------------------------------------------------------
-- ÉTAPE 2 — Table des détails membre + RLS + auto-inscription du rôle 'membre'.
--           (À exécuter APRÈS l'étape 1.)
-- ----------------------------------------------------------------------------

-- 2.1 Détails spécifiques aux membres (une ligne par utilisateur) ------------
create table if not exists public.membre_details (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  zone       text,
  created_at timestamptz not null default now()
);

alter table public.membre_details enable row level security;

create policy "Détails membre : lecture par soi-même ou admin"
  on public.membre_details for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy "Détails membre : écriture par soi-même"
  on public.membre_details for insert to authenticated
  with check (user_id = auth.uid());

create policy "Détails membre : mise à jour par soi-même ou admin"
  on public.membre_details for update to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- 2.2 Étendre l'auto-inscription au rôle 'membre' ---------------------------
--     On remplace la policy d'auto-inscription pour y inclure 'membre'.
--     'admin' reste volontairement EXCLU (jamais auto-attribuable).
drop policy if exists "Rôles : auto-inscription scrutateur/benevole" on public.user_roles;

create policy "Rôles : auto-inscription scrutateur/benevole/membre"
  on public.user_roles for insert to authenticated
  with check (
    user_id = auth.uid()
    and role in ('scrutateur', 'benevole', 'membre')
  );

-- ============================================================================
-- FIN DE LA MIGRATION
-- ============================================================================
