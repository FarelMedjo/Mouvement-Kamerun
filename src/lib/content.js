import { supabase } from './supabase'

// ----------------------------------------------------------------------------
// Accès aux contenus publics et aux soumissions du public.
//
// Lecture : actualités / événements ne renvoient que les contenus PUBLIÉS
// (la policy RLS « lecture publique des contenus publiés » filtre déjà
// publie = true côté serveur ; on le répète ici par clarté).
// Écriture : affiliations et newsletter sont ouvertes au public (anon),
// conformément aux policies d'insertion publiques.
// ----------------------------------------------------------------------------

// --- Lectures ---------------------------------------------------------------

export async function getActualites({ limit } = {}) {
  let q = supabase
    .from('actualites')
    .select('id, titre, contenu, image_url, created_at')
    .eq('publie', true)
    .order('created_at', { ascending: false })
  if (limit) q = q.limit(limit)
  const { data, error } = await q
  if (error) throw error
  return data ?? []
}

export async function getEvenements() {
  const { data, error } = await supabase
    .from('evenements')
    .select('id, titre, description, lieu, date_event, image_url, created_at')
    .eq('publie', true)
    .order('date_event', { ascending: true })
  if (error) throw error
  return data ?? []
}

// Sépare les événements publiés en « à venir » et « passés » par rapport à
// l'instant présent, et identifie le prochain événement.
export async function getEvenementsClasses() {
  const tous = await getEvenements()
  const maintenant = Date.now()
  const aVenir = tous
    .filter((e) => e.date_event && new Date(e.date_event).getTime() >= maintenant)
    .sort((a, b) => new Date(a.date_event) - new Date(b.date_event))
  const passes = tous
    .filter((e) => !e.date_event || new Date(e.date_event).getTime() < maintenant)
    .sort((a, b) => new Date(b.date_event) - new Date(a.date_event))
  return { aVenir, passes, prochain: aVenir[0] ?? null }
}

// --- Écritures (soumissions publiques) --------------------------------------

export async function soumettreAffiliation({ nom, prenom, telephone, email, zone }) {
  // Le statut par défaut « en_attente » est posé par la base.
  const { error } = await supabase.from('affiliations').insert({
    nom,
    prenom: prenom || null,
    telephone: telephone || null,
    email: email || null,
    zone: zone || null,
  })
  if (error) throw error
}

export async function inscrireNewsletter({ email, nom }) {
  const { error } = await supabase.from('newsletter').insert({
    email,
    nom: nom || null,
  })
  if (error) throw error
}
