import { supabase } from './supabase'
import { ROLES } from '../auth/AuthContext'

// ----------------------------------------------------------------------------
// Accès aux données de l'espace bénévole.
//
// SÉCURITÉ (rappel) :
//  - Table benevole_details : un bénévole ne lit/écrit que SA propre ligne
//    (user_id = auth.uid()). Ces règles sont appliquées par la BASE (RLS),
//    pas seulement par l'interface.
//  - Le rôle « benevole » est attribué via public.user_roles (RLS : un
//    utilisateur ne peut s'attribuer que 'scrutateur' ou 'benevole').
//
// Schéma de la table (vérifié) :
//   user_id (uuid, clé) · zone (text) · disponibilites (text) ·
//   secteurs (text[]) · created_at (timestamptz).
// ----------------------------------------------------------------------------

// Secteurs d'intervention proposés au bénévole. `valeur` est la valeur stockée
// (benevole_details.secteurs) — NE PAS traduire. `label`/`desc` sont bilingues
// ({ fr, en }) et résolus à l'affichage via le helper i18n.
export const SECTEURS = [
  { valeur: 'scrutateur', label: { fr: 'Scrutateur', en: 'Poll watcher' }, desc: { fr: 'Surveiller un bureau de vote et transmettre les documents.', en: 'Monitor a polling station and send the documents.' } },
  { valeur: 'graphiste', label: { fr: 'Graphiste', en: 'Graphic designer' }, desc: { fr: 'Concevoir visuels, affiches et supports du mouvement.', en: 'Design visuals, posters and materials for the movement.' } },
  { valeur: 'communicateur', label: { fr: 'Communicateur', en: 'Communicator' }, desc: { fr: 'Animer les réseaux et porter la parole du mouvement.', en: 'Run social media and carry the movement’s message.' } },
  { valeur: 'logistique', label: { fr: 'Logistique', en: 'Logistics' }, desc: { fr: 'Organiser matériel, transport et intendance des actions.', en: 'Organise equipment, transport and the running of actions.' } },
  { valeur: 'mobilisation', label: { fr: 'Mobilisation', en: 'Mobilisation' }, desc: { fr: 'Recruter, fédérer et mobiliser sur le terrain.', en: 'Recruit, unite and mobilise on the ground.' } },
  { valeur: 'autre', label: { fr: 'Autre', en: 'Other' }, desc: { fr: 'Une autre compétence utile au mouvement.', en: 'Another skill useful to the movement.' } },
]

const VALEURS_SECTEURS = SECTEURS.map((s) => s.valeur)

// Filtre/normalise une liste de secteurs sur les valeurs autorisées.
export function nettoyerSecteurs(liste) {
  const set = new Set((liste ?? []).filter((v) => VALEURS_SECTEURS.includes(v)))
  return Array.from(set)
}

// Vrai si le secteur « scrutateur » fait partie des secteurs déclarés.
export function declareScrutateur(secteurs) {
  return (secteurs ?? []).includes('scrutateur')
}

export async function getMesDetails() {
  const { data, error } = await supabase
    .from('benevole_details')
    .select('zone, disponibilites, secteurs, created_at')
    .maybeSingle()
  if (error) throw error
  return data
}

// Enregistre (upsert) les détails du bénévole pour l'utilisateur courant.
export async function enregistrerMesDetails({ zone, disponibilites, secteurs }) {
  const { data: u } = await supabase.auth.getUser()
  const userId = u?.user?.id
  if (!userId) throw new Error('Session introuvable.')
  const { error } = await supabase
    .from('benevole_details')
    .upsert(
      {
        user_id: userId,
        zone: zone || null,
        disponibilites: disponibilites || null,
        secteurs: nettoyerSecteurs(secteurs),
      },
      { onConflict: 'user_id' }
    )
  if (error) throw error
}

// Ajoute le rôle « scrutateur » à l'utilisateur courant (idempotent).
// Permet à un bénévole ayant déclaré le secteur scrutateur d'ouvrir ses droits
// de téléversement. La RLS de user_roles n'autorise que 'scrutateur'/'benevole'
// pour soi-même ; une éventuelle violation d'unicité (rôle déjà présent) est
// ignorée silencieusement.
export async function ajouterRoleScrutateur() {
  const { data: u } = await supabase.auth.getUser()
  const userId = u?.user?.id
  if (!userId) throw new Error('Session introuvable.')
  const { error } = await supabase
    .from('user_roles')
    .upsert({ user_id: userId, role: ROLES.SCRUTATEUR }, { onConflict: 'user_id,role', ignoreDuplicates: true })
  if (error) throw error
}
