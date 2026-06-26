import { supabase } from './supabase'

// ----------------------------------------------------------------------------
// Accès aux données de l'espace scrutateur.
//
// SÉCURITÉ (rappel) :
//  - Bucket privé « documents-electoraux » : convention de chemin
//    <user_id>/<fichier>. Les policies Storage n'autorisent un scrutateur qu'à
//    écrire/lire dans SON dossier ; l'admin lit tout.
//  - Table fichiers : un scrutateur ne lit/écrit que ses propres lignes
//    (scrutateur_id = auth.uid()). Aucune URL publique : tout téléchargement
//    passe par une URL SIGNÉE temporaire.
//  Ces règles sont appliquées par la BASE (RLS), pas seulement par l'interface.
// ----------------------------------------------------------------------------

export const BUCKET = 'documents-electoraux'

// Taille maximale acceptée par fichier (50 Mo). Validation côté client ; à
// doubler côté politiques de bucket / serveur lors du durcissement (étape 6).
export const TAILLE_MAX_OCTETS = 50 * 1024 * 1024

// Types MIME / extensions acceptés, regroupés par nature.
const ACCEPT = {
  pv: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  image: ['image/'],
  audio: ['audio/'],
  video: ['video/'],
}

// Déduit le type_fichier (enum) à partir du fichier.
export function detecterType(file) {
  const mime = (file.type || '').toLowerCase()
  const nom = (file.name || '').toLowerCase()
  if (ACCEPT.pv.includes(mime) || /\.(pdf|docx?|odt)$/.test(nom)) return 'pv'
  if (mime.startsWith('image/')) return 'image'
  if (mime.startsWith('audio/')) return 'audio'
  if (mime.startsWith('video/')) return 'video'
  return 'autre'
}

export function fichierAccepte(file) {
  return detecterType(file) !== 'autre'
}

// Nettoie un nom de fichier pour un chemin de stockage sûr.
function assainirNom(nom) {
  // Retire les accents (diacritiques combinants U+0300–U+036F) puis tout
  // caractère non sûr pour un chemin.
  const base = (nom || 'fichier').normalize('NFD').replace(/[̀-ͯ]/g, '')
  return base.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-120)
}

export async function getMesDetails() {
  const { data, error } = await supabase
    .from('scrutateur_details')
    .select('region, departement, arrondissement, bureau_vote')
    .maybeSingle()
  if (error) throw error
  return data
}

export async function enregistrerMesDetails(details) {
  const { data: u } = await supabase.auth.getUser()
  const userId = u?.user?.id
  if (!userId) throw new Error('Session introuvable.')
  const { error } = await supabase
    .from('scrutateur_details')
    .upsert({ user_id: userId, ...details }, { onConflict: 'user_id' })
  if (error) throw error
}

export async function listerMesFichiers() {
  const { data, error } = await supabase
    .from('fichiers')
    .select('id, type, bureau_vote, storage_path, taille_octets, created_at')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

// Téléverse un fichier dans le dossier privé du scrutateur, puis crée la ligne
// de métadonnées. Retourne la ligne créée.
export async function televerserFichier({ file, bureau }) {
  const { data: u } = await supabase.auth.getUser()
  const userId = u?.user?.id
  if (!userId) throw new Error('Session introuvable.')

  if (!fichierAccepte(file)) {
    throw new Error(`Type non accepté : ${file.name}`)
  }
  if (file.size > TAILLE_MAX_OCTETS) {
    throw new Error(`Fichier trop volumineux (max 50 Mo) : ${file.name}`)
  }

  const type = detecterType(file)
  // Chemin : <user_id>/<horodatage>-<nom> — le 1er segment DOIT être l'uid
  // (exigé par la policy Storage).
  const storagePath = `${userId}/${Date.now()}-${assainirNom(file.name)}`

  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, file, { upsert: false, contentType: file.type || undefined })
  if (upErr) throw upErr

  const { data: row, error: insErr } = await supabase
    .from('fichiers')
    .insert({
      scrutateur_id: userId,
      bureau_vote: bureau || null,
      type,
      storage_path: storagePath,
      taille_octets: file.size,
    })
    .select()
    .single()

  if (insErr) {
    // Compensation : on retire l'objet stocké si l'insertion des métadonnées
    // échoue, pour éviter un fichier orphelin.
    await supabase.storage.from(BUCKET).remove([storagePath])
    throw insErr
  }
  return row
}

// Génère une URL signée temporaire (60 s) pour consulter/télécharger un fichier.
// La policy Storage garantit qu'un scrutateur ne peut signer que SES fichiers.
export async function urlSignee(storagePath) {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, 60)
  if (error) throw error
  return data.signedUrl
}
