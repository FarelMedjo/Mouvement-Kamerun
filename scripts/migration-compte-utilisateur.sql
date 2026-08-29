-- ============================================================================
--  MOUVEMENT KAMERUN — Migration : GESTION DE SON COMPTE
--  Objet : permettre à un utilisateur connecté de SUPPRIMER lui-même son
--          compte, depuis la page « Mon compte » (/mon-compte).
--
--  Pourquoi une fonction en base ?
--    La suppression d'une ligne de `auth.users` n'est pas accessible à la clé
--    publique (anon) : elle exige normalement la clé de service. On expose donc
--    une fonction SECURITY DEFINER étroitement cadrée, qui ne peut supprimer
--    QUE l'utilisateur appelant (auth.uid()) — jamais un autre compte.
--
--  Le changement de mot de passe, lui, ne demande aucune migration : il passe
--  par l'API GoTrue (`supabase.auth.updateUser`), déjà utilisée par l'écran de
--  réinitialisation.
--
--  À appliquer sur une base contenant déjà le schéma de référence
--  (schema_supabase_mouvement_kamerun.sql). Exécutable EN UNE SEULE FOIS.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. Suppression de son propre compte
--    Effet en cascade (déjà déclaré par le schéma de référence, `on delete
--    cascade` sur auth.users) :
--      · public.profiles            · public.user_roles
--      · public.scrutateur_details  · public.benevole_details
--      · public.membre_details      · public.fichiers  (métadonnées)
--    ainsi que les sessions et identités GoTrue de l'utilisateur.
--
--    ⚠️ NON supprimés : les objets déposés dans le bucket privé
--    `documents-electoraux`. La suppression y est réservée à l'admin (policy)
--    et bloquée en SQL direct par le trigger `protect_objects_delete` de
--    Storage. C'est volontaire : un scrutateur ne doit pas pouvoir effacer les
--    pièces électorales déjà transmises. Le ménage éventuel se fait par un
--    administrateur via l'API Storage.
-- ----------------------------------------------------------------------------
create or replace function public.supprimer_mon_compte()
returns void
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  uid       uuid := auth.uid();
  nb_admins integer;
begin
  -- Sans session, rien à supprimer (garde-fou : jamais d'appel anonyme).
  if uid is null then
    raise exception 'Aucune session active.'
      using errcode = '28000';
  end if;

  -- Garde-fou : ne jamais laisser le site sans administrateur. Un admin qui
  -- souhaite partir doit d'abord qu'un autre administrateur soit désigné.
  if public.has_role(uid, 'admin') then
    select count(*) into nb_admins
      from public.user_roles
     where role = 'admin';

    if nb_admins <= 1 then
      raise exception 'Impossible de supprimer le dernier compte administrateur.'
        using errcode = 'P0001';
    end if;
  end if;

  -- Seul le compte de l'appelant peut être supprimé.
  delete from auth.users where id = uid;
end;
$$;

comment on function public.supprimer_mon_compte() is
  'Supprime le compte de l''utilisateur appelant (auth.uid()) et, par cascade, '
  'ses données applicatives. Refuse la suppression du dernier administrateur. '
  'Les fichiers du bucket documents-electoraux sont conservés (ménage admin).';

-- Exposition minimale : réservée aux utilisateurs authentifiés.
revoke all on function public.supprimer_mon_compte() from public;
revoke all on function public.supprimer_mon_compte() from anon;
grant execute on function public.supprimer_mon_compte() to authenticated;

-- ============================================================================
-- FIN DE LA MIGRATION
-- ============================================================================
