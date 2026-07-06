import { supabase } from './supabase'

// ----------------------------------------------------------------------------
// Accès aux données de l'espace membre.
//
// SÉCURITÉ (rappel) :
//  - Table membre_details : un membre ne lit/écrit que SA propre ligne
//    (user_id = auth.uid()). Ces règles sont appliquées par la BASE (RLS),
//    pas seulement par l'interface.
//  - Le rôle « membre » est attribué via public.user_roles (RLS : un
//    utilisateur ne peut s'attribuer que 'scrutateur', 'benevole' ou 'membre').
//
// Schéma de la table :
//   user_id (uuid, clé) · zone (text) · created_at (timestamptz).
// ----------------------------------------------------------------------------

export async function getMesDetails() {
  const { data, error } = await supabase
    .from('membre_details')
    .select('zone, created_at')
    .maybeSingle()
  if (error) throw error
  return data
}

// Enregistre (upsert) les détails du membre pour l'utilisateur courant.
export async function enregistrerMesDetails({ zone }) {
  const { data: u } = await supabase.auth.getUser()
  const userId = u?.user?.id
  if (!userId) throw new Error('Session introuvable.')
  const { error } = await supabase
    .from('membre_details')
    .upsert({ user_id: userId, zone: zone || null }, { onConflict: 'user_id' })
  if (error) throw error
}
