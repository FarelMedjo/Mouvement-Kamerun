import { supabase } from './supabase'
import { BUCKET } from './scrutateur'
import { BUCKET_DOCUMENTS_PUBLICS } from './content'

// ----------------------------------------------------------------------------
// Accès aux données de l'espace ADMINISTRATEUR.
//
// SÉCURITÉ (rappel) : toutes ces requêtes ne réussissent que si l'utilisateur
// connecté possède réellement le rôle 'admin'. Ce n'est PAS l'interface qui en
// décide : chaque table/objet est protégé par une policy RLS `is_admin()` côté
// serveur (lecture de TOUS les fichiers, profils, affiliations, newsletter ;
// gestion des contenus ; mise à jour du statut des affiliations). Un appel issu
// d'un compte non-admin renverra simplement des données vides ou une erreur.
//
// Les jointures se font côté client : les tables `fichiers`,
// `scrutateur_details`, etc. référencent `auth.users` et non `profiles`, on
// récupère donc les profils séparément puis on assemble par `id`.
// ----------------------------------------------------------------------------

// Indexe un tableau d'objets par une clé, pour des jointures côté client.
function indexer(rows, cle) {
  const map = new Map()
  for (const r of rows ?? []) map.set(r[cle], r)
  return map
}

function uniq(values) {
  return [...new Set(values.filter(Boolean))]
}

// --- Vue d'ensemble ---------------------------------------------------------

// Compte les lignes de plusieurs tables en une passe (head: true => pas de
// transfert de données, seulement le total).
export async function getStatistiques() {
  const compter = async (table, filtre) => {
    let q = supabase.from(table).select('*', { count: 'exact', head: true })
    if (filtre) q = filtre(q)
    const { count, error } = await q
    if (error) throw error
    return count ?? 0
  }
  const [fichiers, scrutateurs, benevoles, affiliationsEnAttente, newsletter] = await Promise.all([
    compter('fichiers'),
    compter('user_roles', (q) => q.eq('role', 'scrutateur')),
    compter('user_roles', (q) => q.eq('role', 'benevole')),
    compter('affiliations', (q) => q.eq('statut', 'en_attente')),
    compter('newsletter'),
  ])
  return { fichiers, scrutateurs, benevoles, affiliationsEnAttente, newsletter }
}

// --- Réception centralisée des fichiers -------------------------------------

// Liste TOUS les fichiers transmis par les scrutateurs, enrichis du nom du
// scrutateur (profil) et de son bureau de vote enregistré.
export async function listerTousFichiers() {
  const { data: fichiers, error } = await supabase
    .from('fichiers')
    .select('id, scrutateur_id, bureau_vote, type, storage_path, taille_octets, created_at')
    .order('created_at', { ascending: false })
  if (error) throw error
  if (!fichiers?.length) return []

  const ids = uniq(fichiers.map((f) => f.scrutateur_id))
  const [{ data: profils }, { data: details }] = await Promise.all([
    supabase.from('profiles').select('id, nom_complet, telephone').in('id', ids),
    supabase.from('scrutateur_details').select('user_id, region, bureau_vote').in('user_id', ids),
  ])
  const pMap = indexer(profils, 'id')
  const dMap = indexer(details, 'user_id')

  return fichiers.map((f) => {
    const p = pMap.get(f.scrutateur_id)
    const d = dMap.get(f.scrutateur_id)
    return {
      ...f,
      nom_fichier: f.storage_path.split('/').slice(1).join('/').replace(/^\d+-/, ''),
      scrutateur_nom: p?.nom_complet || '—',
      // Bureau du fichier, sinon bureau enregistré dans la fiche du scrutateur.
      bureau: f.bureau_vote || d?.bureau_vote || null,
      region: d?.region || null,
    }
  })
}

// URL signée temporaire (admin) pour consulter/télécharger n'importe quel
// fichier — la policy Storage autorise l'admin à signer tout le bucket.
export async function urlSigneeFichier(storagePath) {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(storagePath, 60)
  if (error) throw error
  return data.signedUrl
}

// --- Comptes : scrutateurs & bénévoles --------------------------------------

// Construit la liste des comptes d'un rôle donné, avec profil + détails.
async function listerComptes(role, tableDetails, colonnesDetails) {
  const { data: roles, error } = await supabase
    .from('user_roles')
    .select('user_id, created_at')
    .eq('role', role)
    .order('created_at', { ascending: false })
  if (error) throw error
  if (!roles?.length) return []

  const ids = uniq(roles.map((r) => r.user_id))
  const [{ data: profils }, detailsRes] = await Promise.all([
    supabase.from('profiles').select('id, nom_complet, telephone, created_at').in('id', ids),
    supabase.from(tableDetails).select(colonnesDetails).in('user_id', ids),
  ])
  const pMap = indexer(profils, 'id')
  const dMap = indexer(detailsRes.data, 'user_id')

  return roles.map((r) => ({
    user_id: r.user_id,
    inscrit_le: r.created_at,
    profil: pMap.get(r.user_id) || null,
    details: dMap.get(r.user_id) || null,
  }))
}

export function listerScrutateurs() {
  return listerComptes(
    'scrutateur',
    'scrutateur_details',
    'user_id, region, departement, arrondissement, bureau_vote'
  )
}

export function listerBenevoles() {
  return listerComptes('benevole', 'benevole_details', 'user_id, zone, disponibilites, secteurs')
}

// --- Demandes d'affiliation -------------------------------------------------

export async function listerAffiliations() {
  const { data, error } = await supabase
    .from('affiliations')
    .select('id, nom, prenom, telephone, email, zone, statut, created_at')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

// Met à jour le statut d'une demande : 'validee' ou 'rejetee' (ou 'en_attente').
export async function mettreAJourStatutAffiliation(id, statut) {
  const { error } = await supabase.from('affiliations').update({ statut }).eq('id', id)
  if (error) throw error
}

// --- Newsletter -------------------------------------------------------------

export async function listerNewsletter() {
  const { data, error } = await supabase
    .from('newsletter')
    .select('id, email, nom, created_at')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

// --- Gestion des contenus publics : actualités & événements -----------------
// L'admin lit aussi les brouillons (policy SELECT : publie OR is_admin).

export async function listerActualitesAdmin() {
  const { data, error } = await supabase
    .from('actualites')
    .select('id, titre, titre_en, contenu, contenu_en, image_url, publie, created_at')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function creerActualite({ titre, titre_en, contenu, contenu_en, image_url, publie }) {
  const { data, error } = await supabase
    .from('actualites')
    .insert({
      titre,
      titre_en: titre_en || null,
      contenu: contenu || null,
      contenu_en: contenu_en || null,
      image_url: image_url || null,
      publie: !!publie,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function basculerPublicationActualite(id, publie) {
  const { error } = await supabase.from('actualites').update({ publie }).eq('id', id)
  if (error) throw error
}

export async function supprimerActualite(id) {
  const { error } = await supabase.from('actualites').delete().eq('id', id)
  if (error) throw error
}

export async function listerEvenementsAdmin() {
  const { data, error } = await supabase
    .from('evenements')
    .select('id, titre, description, lieu, date_event, image_url, publie, created_at')
    .order('date_event', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function creerEvenement({ titre, description, lieu, date_event, image_url, publie }) {
  const { data, error } = await supabase
    .from('evenements')
    .insert({
      titre,
      description: description || null,
      lieu: lieu || null,
      date_event: date_event || null,
      image_url: image_url || null,
      publie: !!publie,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function basculerPublicationEvenement(id, publie) {
  const { error } = await supabase.from('evenements').update({ publie }).eq('id', id)
  if (error) throw error
}

export async function supprimerEvenement(id) {
  const { error } = await supabase.from('evenements').delete().eq('id', id)
  if (error) throw error
}

// --- Gestion des messages vidéo ---------------------------------------------
// Même modèle que les actualités : l'admin lit aussi les brouillons (policy
// SELECT : publie OR is_admin), et seul l'admin écrit (policy ALL : is_admin).

// Accepte un identifiant YouTube brut (11 caractères) OU une URL complète
// (watch?v=, youtu.be/, embed/, shorts/) et renvoie l'identifiant seul.
export function extraireYoutubeId(saisie) {
  const s = (saisie || '').trim()
  if (!s) return ''
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s
  const m = s.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{11})/)
  return m ? m[1] : s
}

export async function listerMessagesVideoAdmin() {
  const { data, error } = await supabase
    .from('messages_video')
    .select('id, titre, titre_en, youtube_id, youtube_id_en, ordre, publie, created_at')
    .order('ordre', { ascending: true })
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function creerMessageVideo({ titre, titre_en, youtube_id, youtube_id_en, ordre, publie }) {
  const { data, error } = await supabase
    .from('messages_video')
    .insert({
      titre,
      titre_en: titre_en || null,
      youtube_id: extraireYoutubeId(youtube_id),
      youtube_id_en: youtube_id_en ? extraireYoutubeId(youtube_id_en) : null,
      ordre: Number.isFinite(ordre) ? ordre : 0,
      publie: !!publie,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function basculerPublicationMessageVideo(id, publie) {
  const { error } = await supabase.from('messages_video').update({ publie }).eq('id', id)
  if (error) throw error
}

export async function supprimerMessageVideo(id) {
  const { error } = await supabase.from('messages_video').delete().eq('id', id)
  if (error) throw error
}

// Réécrit la colonne `ordre` à partir de la position dans `idsOrdonnes`
// (1-based). Une mise à jour par ligne — le nombre de vidéos reste petit.
export async function reordonnerMessagesVideo(idsOrdonnes) {
  await Promise.all(
    idsOrdonnes.map((id, i) =>
      supabase
        .from('messages_video')
        .update({ ordre: i + 1 })
        .eq('id', id)
        .then(({ error }) => {
          if (error) throw error
        })
    )
  )
}

// --- Gestion des thèmes du programme ----------------------------------------
// Même modèle que les messages vidéo : l'admin lit aussi les brouillons (policy
// SELECT : publie OR is_admin), et seul l'admin écrit (policy ALL : is_admin).
// `points` / `points_en` sont des tableaux de chaînes alignés par index.

// Découpe une saisie multi-lignes en tableau de points (une ligne = un point),
// en supprimant les lignes vides et les espaces superflus.
export function lignesEnPoints(saisie) {
  return (saisie || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
}

export async function listerProgrammeThemesAdmin() {
  const { data, error } = await supabase
    .from('programme_themes')
    .select('id, titre, titre_en, couleur, points, points_en, ordre, publie, created_at')
    .order('ordre', { ascending: true })
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function creerProgrammeTheme({ titre, titre_en, couleur, points, points_en, ordre, publie }) {
  const { data, error } = await supabase
    .from('programme_themes')
    .insert({
      titre,
      titre_en: titre_en || null,
      couleur: couleur || 'kgreen',
      points: Array.isArray(points) ? points : [],
      points_en: Array.isArray(points_en) ? points_en : [],
      ordre: Number.isFinite(ordre) ? ordre : 0,
      publie: !!publie,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function basculerPublicationProgrammeTheme(id, publie) {
  const { error } = await supabase.from('programme_themes').update({ publie }).eq('id', id)
  if (error) throw error
}

export async function supprimerProgrammeTheme(id) {
  const { error } = await supabase.from('programme_themes').delete().eq('id', id)
  if (error) throw error
}

// Réécrit la colonne `ordre` à partir de la position dans `idsOrdonnes`
// (1-based). Une mise à jour par ligne — le nombre de thèmes reste petit.
export async function reordonnerProgrammeThemes(idsOrdonnes) {
  await Promise.all(
    idsOrdonnes.map((id, i) =>
      supabase
        .from('programme_themes')
        .update({ ordre: i + 1 })
        .eq('id', id)
        .then(({ error }) => {
          if (error) throw error
        })
    )
  )
}

// --- Gestion de la bibliothèque de documents (Ressources) -------------------
// Même modèle que les messages vidéo : l'admin lit aussi les brouillons (policy
// SELECT : publie OR is_admin), et seul l'admin écrit (policy ALL : is_admin).
// Un document = lien externe (url) OU fichier téléversé dans le bucket public
// documents-publics (storage_path).

// Extensions / types acceptés pour un document téléversé.
const TAILLE_MAX_DOCUMENT = 25 * 1024 * 1024 // 25 Mo

// Nettoie un nom de fichier pour un chemin de stockage sûr (sans accents ni
// caractères spéciaux).
function assainirNomDocument(nom) {
  const base = (nom || 'document').normalize('NFD').replace(/[̀-ͯ]/g, '')
  return base.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-120)
}

export async function listerRessourcesAdmin() {
  const { data, error } = await supabase
    .from('ressources')
    .select('id, titre, titre_en, url, storage_path, ordre, publie, created_at')
    .order('ordre', { ascending: true })
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

// Téléverse un document dans le bucket public et renvoie son chemin de stockage.
export async function televerserDocumentRessource(file) {
  if (file.size > TAILLE_MAX_DOCUMENT) {
    throw new Error(`Fichier trop volumineux (max 25 Mo) : ${file.name}`)
  }
  const storagePath = `${Date.now()}-${assainirNomDocument(file.name)}`
  const { error } = await supabase.storage
    .from(BUCKET_DOCUMENTS_PUBLICS)
    .upload(storagePath, file, { upsert: false, contentType: file.type || undefined })
  if (error) throw error
  return storagePath
}

export async function creerRessource({ titre, titre_en, url, storage_path, ordre, publie }) {
  const { data, error } = await supabase
    .from('ressources')
    .insert({
      titre,
      titre_en: titre_en || null,
      url: url || null,
      storage_path: storage_path || null,
      ordre: Number.isFinite(ordre) ? ordre : 0,
      publie: !!publie,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function basculerPublicationRessource(id, publie) {
  const { error } = await supabase.from('ressources').update({ publie }).eq('id', id)
  if (error) throw error
}

// Supprime la ressource et, le cas échéant, son fichier téléversé (via l'API
// Storage — la suppression SQL directe est interdite par le trigger).
export async function supprimerRessource(ressource) {
  if (ressource.storage_path) {
    await supabase.storage.from(BUCKET_DOCUMENTS_PUBLICS).remove([ressource.storage_path])
  }
  const { error } = await supabase.from('ressources').delete().eq('id', ressource.id)
  if (error) throw error
}

// Réécrit la colonne `ordre` à partir de la position dans `idsOrdonnes`
// (1-based). Une mise à jour par ligne — le nombre de documents reste petit.
export async function reordonnerRessources(idsOrdonnes) {
  await Promise.all(
    idsOrdonnes.map((id, i) =>
      supabase
        .from('ressources')
        .update({ ordre: i + 1 })
        .eq('id', id)
        .then(({ error }) => {
          if (error) throw error
        })
    )
  )
}

// --- Export CSV (newsletter, etc.) ------------------------------------------

// Échappe une valeur pour le format CSV (RFC 4180 : guillemets doublés).
function champCsv(v) {
  const s = v == null ? '' : String(v)
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

// Construit un CSV (séparateur « ; », adapté à Excel FR) et déclenche le
// téléchargement dans le navigateur. `colonnes` = [{ cle, libelle }].
export function exporterCsv(nomFichier, colonnes, lignes) {
  const entete = colonnes.map((c) => champCsv(c.libelle)).join(';')
  const corps = lignes
    .map((l) => colonnes.map((c) => champCsv(l[c.cle])).join(';'))
    .join('\n')
  // BOM UTF-8 pour qu'Excel reconnaisse les accents.
  const contenu = '﻿' + entete + '\n' + corps
  const blob = new Blob([contenu], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nomFichier
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
