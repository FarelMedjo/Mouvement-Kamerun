import { supabase } from './supabase'

// ----------------------------------------------------------------------------
// Accès aux contenus publics et aux soumissions du public.
//
// Lecture : actualités / événements ne renvoient que les contenus PUBLIÉS
// (la policy RLS « lecture publique des contenus publiés » filtre déjà
// publie = true côté serveur ; on le répète ici par clarté).
// Écriture : la newsletter est ouverte au public (anon), conformément à la
// policy d'insertion publique. (L'adhésion crée désormais un compte membre —
// voir Adhesion.jsx / AuthContext — et n'écrit plus dans `affiliations`.)
// ----------------------------------------------------------------------------

// --- Lectures ---------------------------------------------------------------

export async function getActualites({ limit } = {}) {
  let q = supabase
    .from('actualites')
    .select('id, titre, titre_en, contenu, contenu_en, image_url, created_at')
    .eq('publie', true)
    .order('created_at', { ascending: false })
  if (limit) q = q.limit(limit)
  const { data, error } = await q
  if (error) throw error
  return data ?? []
}

// Un article publié par son id (null s'il n'existe pas ou n'est pas publié).
export async function getActualite(id) {
  const { data, error } = await supabase
    .from('actualites')
    .select('id, titre, titre_en, contenu, contenu_en, image_url, created_at')
    .eq('id', id)
    .eq('publie', true)
    .maybeSingle()
  if (error) throw error
  return data ?? null
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

export async function getMessagesVideo({ limit } = {}) {
  let q = supabase
    .from('messages_video')
    .select('id, titre, titre_en, youtube_id, youtube_id_en, ordre, created_at')
    .eq('publie', true)
    .order('ordre', { ascending: true })
    .order('created_at', { ascending: true })
  if (limit) q = q.limit(limit)
  const { data, error } = await q
  if (error) throw error
  return data ?? []
}

export async function getProgrammeThemes() {
  const { data, error } = await supabase
    .from('programme_themes')
    .select('id, titre, titre_en, couleur, points, points_en, ordre')
    .eq('publie', true)
    .order('ordre', { ascending: true })
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

// Bucket public des documents téléversés de la bibliothèque Ressources.
export const BUCKET_DOCUMENTS_PUBLICS = 'documents-publics'

// URL publique d'un document téléversé (bucket public → pas d'URL signée).
export function urlPubliqueRessource(storagePath) {
  return supabase.storage.from(BUCKET_DOCUMENTS_PUBLICS).getPublicUrl(storagePath).data.publicUrl
}

// Lien de téléchargement d'une ressource : fichier téléversé prioritaire,
// sinon lien externe saisi par l'admin (null si aucun des deux).
export function lienRessource(r) {
  if (r.storage_path) return urlPubliqueRessource(r.storage_path)
  return r.url || null
}

// Bibliothèque de documents publics (page Ressources) : ne renvoie que les
// entrées publiées, dans l'ordre d'affichage défini par l'admin.
export async function getRessources() {
  const { data, error } = await supabase
    .from('ressources')
    .select('id, titre, titre_en, url, storage_path, ordre, created_at')
    .eq('publie', true)
    .order('ordre', { ascending: true })
    .order('created_at', { ascending: true })
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

export async function inscrireNewsletter({ email, nom }) {
  const { error } = await supabase.from('newsletter').insert({
    email,
    nom: nom || null,
  })
  if (error) throw error
}
