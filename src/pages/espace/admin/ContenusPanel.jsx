import { useEffect, useRef, useState } from 'react'
import {
  listerActualitesAdmin,
  creerActualite,
  basculerPublicationActualite,
  supprimerActualite,
  listerEvenementsAdmin,
  creerEvenement,
  basculerPublicationEvenement,
  supprimerEvenement,
  listerMessagesVideoAdmin,
  creerMessageVideo,
  basculerPublicationMessageVideo,
  supprimerMessageVideo,
  reordonnerMessagesVideo,
  listerProgrammeThemesAdmin,
  creerProgrammeTheme,
  basculerPublicationProgrammeTheme,
  supprimerProgrammeTheme,
  reordonnerProgrammeThemes,
  lignesEnPoints,
  listerRessourcesAdmin,
  creerRessource,
  televerserDocumentRessource,
  basculerPublicationRessource,
  supprimerRessource,
  reordonnerRessources,
} from '../../../lib/admin'
import { formatDateLongue } from '../../../lib/dates'
import { PanelHeader, Carte, EtatVide, Chargement, Champ, ChampZone, ChampSelect } from './ui'
import { useLang } from '../../../i18n/LanguageContext'

// Gestion des contenus publics : créer et publier actualités et événements.
export default function ContenusPanel() {
  const t = useLang().t
  const [onglet, setOnglet] = useState('actualites')
  return (
    <div>
      <PanelHeader
        titre={t('Contenus publics', 'Public content')}
        sousTitre={t('Créez et publiez les actualités, les événements, les messages vidéo, les thèmes du programme et les documents visibles du public.', 'Create and publish the news, events, video messages, programme themes and documents visible to the public.')}
        actions={
          <div className="inline-flex rounded-md border border-[#d7dce3] p-1">
            {[
              ['actualites', t('Actualités', 'News')],
              ['evenements', t('Événements', 'Events')],
              ['videos', t('Vidéos', 'Videos')],
              ['programme', t('Programme', 'Programme')],
              ['documents', t('Documents', 'Documents')],
            ].map(([cle, lbl]) => (
              <button
                key={cle}
                type="button"
                onClick={() => setOnglet(cle)}
                className={`rounded px-3 py-[6px] font-sans text-[13px] font-bold ${
                  onglet === cle ? 'bg-kgreen text-white' : 'text-kink'
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>
        }
      />
      {onglet === 'actualites' ? (
        <SectionActualites />
      ) : onglet === 'evenements' ? (
        <SectionEvenements />
      ) : onglet === 'videos' ? (
        <SectionVideos />
      ) : onglet === 'programme' ? (
        <SectionProgramme />
      ) : (
        <SectionRessources />
      )}
    </div>
  )
}

function BoutonsLigne({ publie, busy, onPublier, onSupprimer }) {
  const t = useLang().t
  return (
    <div className="flex flex-none items-center gap-2">
      <button
        type="button"
        disabled={busy}
        onClick={onPublier}
        className={`rounded-md px-3 py-[7px] font-sans text-[13px] font-bold disabled:opacity-50 ${
          publie ? 'border border-[#d7dce3] text-kink' : 'bg-kgreen text-white'
        }`}
      >
        {publie ? t('Dépublier', 'Unpublish') : t('Publier', 'Publish')}
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={onSupprimer}
        className="rounded-md border border-kred px-3 py-[7px] font-sans text-[13px] font-bold text-kred disabled:opacity-50"
      >
        {t('Suppr.', 'Delete')}
      </button>
    </div>
  )
}

function PastillePublie({ publie }) {
  const t = useLang().t
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-[10px] py-[5px] font-sans text-[11px] font-bold ${
        publie ? 'bg-kgreen/10 text-kgreen' : 'bg-[#fff5d6] text-[#8a6d1a]'
      }`}
    >
      {publie ? t('Publié', 'Published') : t('Brouillon', 'Draft')}
    </span>
  )
}

// --- Actualités -------------------------------------------------------------

function SectionActualites() {
  const { lang, t } = useLang()
  const [liste, setListe] = useState([])
  const [chargement, setChargement] = useState(true)
  const [busy, setBusy] = useState(null)

  const [titre, setTitre] = useState('')
  const [titreEn, setTitreEn] = useState('')
  const [contenu, setContenu] = useState('')
  const [contenuEn, setContenuEn] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [envoi, setEnvoi] = useState(false)
  const [erreur, setErreur] = useState('')

  const charger = () =>
    listerActualitesAdmin()
      .then(setListe)
      .catch(() => {})
      .finally(() => setChargement(false))
  useEffect(() => {
    charger()
  }, [])

  const soumettre = async (e, publier) => {
    e.preventDefault()
    setErreur('')
    if (!titre.trim()) {
      setErreur(t('Le titre est obligatoire.', 'The title is required.'))
      return
    }
    setEnvoi(true)
    try {
      await creerActualite({
        titre: titre.trim(),
        titre_en: titreEn.trim(),
        contenu,
        contenu_en: contenuEn,
        image_url: imageUrl,
        publie: publier,
      })
      setTitre('')
      setTitreEn('')
      setContenu('')
      setContenuEn('')
      setImageUrl('')
      await charger()
    } catch (e2) {
      setErreur(e2?.message || t('Échec de la création.', 'Creation failed.'))
    } finally {
      setEnvoi(false)
    }
  }

  const basculer = async (a) => {
    setBusy(a.id)
    try {
      await basculerPublicationActualite(a.id, !a.publie)
      setListe((prev) => prev.map((x) => (x.id === a.id ? { ...x, publie: !a.publie } : x)))
    } catch (e) {
      alert(e?.message || t('Échec.', 'Failed.'))
    } finally {
      setBusy(null)
    }
  }

  const supprimer = async (a) => {
    if (!window.confirm(t(`Supprimer définitivement « ${a.titre} » ?`, `Permanently delete “${a.titre}”?`))) return
    setBusy(a.id)
    try {
      await supprimerActualite(a.id)
      setListe((prev) => prev.filter((x) => x.id !== a.id))
    } catch (e) {
      alert(e?.message || t('Échec.', 'Failed.'))
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="flex flex-wrap items-start gap-6">
      {/* Formulaire de création */}
      <Carte className="flex-1 basis-[340px]">
        <form onSubmit={(e) => soumettre(e, false)} className="flex flex-col gap-4 p-5">
          <div className="font-sans text-[13px] font-bold uppercase tracking-[0.08em] text-knavy">
            {t('Nouvelle actualité', 'New news item')}
          </div>
          {erreur && <div className="font-sans text-[13px] text-kred">{erreur}</div>}
          <Champ label={t('Titre (FR)', 'Title (FR)')} value={titre} onChange={(e) => setTitre(e.target.value)} placeholder={t("Titre de l'actualité", 'News title')} />
          <Champ label={t('Titre (EN, optionnel)', 'Title (EN, optional)')} value={titreEn} onChange={(e) => setTitreEn(e.target.value)} placeholder={t('Titre en anglais', 'English title')} />
          <ChampZone label={t('Contenu (FR)', 'Content (FR)')} value={contenu} onChange={(e) => setContenu(e.target.value)} placeholder={t("Texte de l'actualité…", 'News text…')} />
          <ChampZone label={t('Contenu (EN, optionnel)', 'Content (EN, optional)')} value={contenuEn} onChange={(e) => setContenuEn(e.target.value)} placeholder={t("Texte en anglais…", 'English text…')} />
          <Champ label={t('Image (URL)', 'Image (URL)')} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" />
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={envoi}
              className="rounded-md border border-[#d7dce3] px-4 py-2 font-sans text-[14px] font-bold text-knavy disabled:opacity-50"
            >
              {t('Enregistrer en brouillon', 'Save as draft')}
            </button>
            <button
              type="button"
              disabled={envoi}
              onClick={(e) => soumettre(e, true)}
              className="rounded-md bg-kgreen px-4 py-2 font-sans text-[14px] font-bold text-white disabled:opacity-50"
            >
              {envoi ? '…' : t('Publier', 'Publish')}
            </button>
          </div>
        </form>
      </Carte>

      {/* Liste existante */}
      <Carte className="flex-1 basis-[420px]">
        {chargement ? (
          <Chargement />
        ) : liste.length === 0 ? (
          <EtatVide>{t('Aucune actualité.', 'No news.')}</EtatVide>
        ) : (
          liste.map((a) => (
            <div
              key={a.id}
              className="flex flex-wrap items-center gap-3 border-b border-[#f1f3f6] px-5 py-[14px] last:border-b-0"
            >
              <div className="min-w-0 flex-1">
                <div className="truncate font-sans text-[15px] font-semibold text-knavy">{a.titre}</div>
                <div className="mt-1 font-sans text-[12px] text-kfaint">{formatDateLongue(a.created_at, lang)}</div>
              </div>
              <PastillePublie publie={a.publie} />
              <BoutonsLigne
                publie={a.publie}
                busy={busy === a.id}
                onPublier={() => basculer(a)}
                onSupprimer={() => supprimer(a)}
              />
            </div>
          ))
        )}
      </Carte>
    </div>
  )
}

// --- Événements -------------------------------------------------------------

function SectionEvenements() {
  const { lang, t } = useLang()
  const [liste, setListe] = useState([])
  const [chargement, setChargement] = useState(true)
  const [busy, setBusy] = useState(null)

  const [titre, setTitre] = useState('')
  const [description, setDescription] = useState('')
  const [lieu, setLieu] = useState('')
  const [dateEvent, setDateEvent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [envoi, setEnvoi] = useState(false)
  const [erreur, setErreur] = useState('')

  const charger = () =>
    listerEvenementsAdmin()
      .then(setListe)
      .catch(() => {})
      .finally(() => setChargement(false))
  useEffect(() => {
    charger()
  }, [])

  const soumettre = async (e, publier) => {
    e.preventDefault()
    setErreur('')
    if (!titre.trim()) {
      setErreur(t('Le titre est obligatoire.', 'The title is required.'))
      return
    }
    setEnvoi(true)
    try {
      await creerEvenement({
        titre: titre.trim(),
        description,
        lieu,
        date_event: dateEvent ? new Date(dateEvent).toISOString() : null,
        image_url: imageUrl,
        publie: publier,
      })
      setTitre('')
      setDescription('')
      setLieu('')
      setDateEvent('')
      setImageUrl('')
      await charger()
    } catch (e2) {
      setErreur(e2?.message || t('Échec de la création.', 'Creation failed.'))
    } finally {
      setEnvoi(false)
    }
  }

  const basculer = async (ev) => {
    setBusy(ev.id)
    try {
      await basculerPublicationEvenement(ev.id, !ev.publie)
      setListe((prev) => prev.map((x) => (x.id === ev.id ? { ...x, publie: !ev.publie } : x)))
    } catch (e) {
      alert(e?.message || t('Échec.', 'Failed.'))
    } finally {
      setBusy(null)
    }
  }

  const supprimer = async (ev) => {
    if (!window.confirm(t(`Supprimer définitivement « ${ev.titre} » ?`, `Permanently delete “${ev.titre}”?`))) return
    setBusy(ev.id)
    try {
      await supprimerEvenement(ev.id)
      setListe((prev) => prev.filter((x) => x.id !== ev.id))
    } catch (e) {
      alert(e?.message || t('Échec.', 'Failed.'))
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="flex flex-wrap items-start gap-6">
      <Carte className="flex-1 basis-[340px]">
        <form onSubmit={(e) => soumettre(e, false)} className="flex flex-col gap-4 p-5">
          <div className="font-sans text-[13px] font-bold uppercase tracking-[0.08em] text-knavy">
            {t('Nouvel événement', 'New event')}
          </div>
          {erreur && <div className="font-sans text-[13px] text-kred">{erreur}</div>}
          <Champ label={t('Titre', 'Title')} value={titre} onChange={(e) => setTitre(e.target.value)} placeholder={t("Titre de l'événement", 'Event title')} />
          <ChampZone label={t('Description', 'Description')} value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('Description…', 'Description…')} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Champ label={t('Lieu', 'Location')} value={lieu} onChange={(e) => setLieu(e.target.value)} placeholder={t('Ville, salle…', 'City, venue…')} />
            <Champ label={t('Date et heure', 'Date and time')} type="datetime-local" value={dateEvent} onChange={(e) => setDateEvent(e.target.value)} />
          </div>
          <Champ label={t('Image (URL)', 'Image (URL)')} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" />
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={envoi}
              className="rounded-md border border-[#d7dce3] px-4 py-2 font-sans text-[14px] font-bold text-knavy disabled:opacity-50"
            >
              {t('Enregistrer en brouillon', 'Save as draft')}
            </button>
            <button
              type="button"
              disabled={envoi}
              onClick={(e) => soumettre(e, true)}
              className="rounded-md bg-kgreen px-4 py-2 font-sans text-[14px] font-bold text-white disabled:opacity-50"
            >
              {envoi ? '…' : t('Publier', 'Publish')}
            </button>
          </div>
        </form>
      </Carte>

      <Carte className="flex-1 basis-[420px]">
        {chargement ? (
          <Chargement />
        ) : liste.length === 0 ? (
          <EtatVide>{t('Aucun événement.', 'No events.')}</EtatVide>
        ) : (
          liste.map((ev) => (
            <div
              key={ev.id}
              className="flex flex-wrap items-center gap-3 border-b border-[#f1f3f6] px-5 py-[14px] last:border-b-0"
            >
              <div className="min-w-0 flex-1">
                <div className="truncate font-sans text-[15px] font-semibold text-knavy">{ev.titre}</div>
                <div className="mt-1 font-sans text-[12px] text-kfaint">
                  {ev.date_event ? formatDateLongue(ev.date_event, lang) : t('Date non précisée', 'Date not specified')}
                  {ev.lieu ? ` · ${ev.lieu}` : ''}
                </div>
              </div>
              <PastillePublie publie={ev.publie} />
              <BoutonsLigne
                publie={ev.publie}
                busy={busy === ev.id}
                onPublier={() => basculer(ev)}
                onSupprimer={() => supprimer(ev)}
              />
            </div>
          ))
        )}
      </Carte>
    </div>
  )
}

// --- Messages vidéo ---------------------------------------------------------

function SectionVideos() {
  const t = useLang().t
  const [liste, setListe] = useState([])
  const [chargement, setChargement] = useState(true)
  const [busy, setBusy] = useState(null)

  const [titre, setTitre] = useState('')
  const [titreEn, setTitreEn] = useState('')
  const [youtube, setYoutube] = useState('')
  const [youtubeEn, setYoutubeEn] = useState('')
  const [ordre, setOrdre] = useState('')
  const [envoi, setEnvoi] = useState(false)
  const [erreur, setErreur] = useState('')
  const [dragIndex, setDragIndex] = useState(null)
  const [survol, setSurvol] = useState(null) // index actuellement survolé en glissé

  const charger = () =>
    listerMessagesVideoAdmin()
      .then(setListe)
      .catch(() => {})
      .finally(() => setChargement(false))
  useEffect(() => {
    charger()
  }, [])

  const soumettre = async (e, publier) => {
    e.preventDefault()
    setErreur('')
    if (!titre.trim()) {
      setErreur(t('Le titre est obligatoire.', 'The title is required.'))
      return
    }
    if (!youtube.trim()) {
      setErreur(t("L'identifiant ou le lien YouTube est obligatoire.", 'The YouTube ID or link is required.'))
      return
    }
    setEnvoi(true)
    try {
      await creerMessageVideo({
        titre: titre.trim(),
        titre_en: titreEn.trim(),
        youtube_id: youtube.trim(),
        youtube_id_en: youtubeEn.trim(),
        ordre: ordre.trim() === '' ? 0 : parseInt(ordre, 10),
        publie: publier,
      })
      setTitre('')
      setTitreEn('')
      setYoutube('')
      setYoutubeEn('')
      setOrdre('')
      await charger()
    } catch (e2) {
      setErreur(e2?.message || t('Échec de la création.', 'Creation failed.'))
    } finally {
      setEnvoi(false)
    }
  }

  const basculer = async (v) => {
    setBusy(v.id)
    try {
      await basculerPublicationMessageVideo(v.id, !v.publie)
      setListe((prev) => prev.map((x) => (x.id === v.id ? { ...x, publie: !v.publie } : x)))
    } catch (e) {
      alert(e?.message || t('Échec.', 'Failed.'))
    } finally {
      setBusy(null)
    }
  }

  const supprimer = async (v) => {
    if (!window.confirm(t(`Supprimer définitivement « ${v.titre} » ?`, `Permanently delete “${v.titre}”?`))) return
    setBusy(v.id)
    try {
      await supprimerMessageVideo(v.id)
      setListe((prev) => prev.filter((x) => x.id !== v.id))
    } catch (e) {
      alert(e?.message || t('Échec.', 'Failed.'))
    } finally {
      setBusy(null)
    }
  }

  // Dépose l'élément glissé (dragIndex) à la position `cible`, met à jour
  // l'ordre local (1-based) puis persiste. Restaure en cas d'échec.
  const deposer = async (cible) => {
    const source = dragIndex
    setDragIndex(null)
    setSurvol(null)
    if (source === null || source === cible) return
    const avant = liste
    const reordonnee = [...liste]
    const [deplace] = reordonnee.splice(source, 1)
    reordonnee.splice(cible, 0, deplace)
    const avecOrdre = reordonnee.map((v, i) => ({ ...v, ordre: i + 1 }))
    setListe(avecOrdre)
    try {
      await reordonnerMessagesVideo(avecOrdre.map((v) => v.id))
    } catch (e) {
      setListe(avant) // rollback visuel si la persistance échoue
      alert(e?.message || t("Échec du réordonnancement.", 'Reordering failed.'))
    }
  }

  return (
    <div className="flex flex-wrap items-start gap-6">
      <Carte className="flex-1 basis-[340px]">
        <form onSubmit={(e) => soumettre(e, false)} className="flex flex-col gap-4 p-5">
          <div className="font-sans text-[13px] font-bold uppercase tracking-[0.08em] text-knavy">
            {t('Nouvelle vidéo', 'New video')}
          </div>
          {erreur && <div className="font-sans text-[13px] text-kred">{erreur}</div>}
          <Champ label={t('Titre (FR)', 'Title (FR)')} value={titre} onChange={(e) => setTitre(e.target.value)} placeholder={t('Titre de la vidéo', 'Video title')} />
          <Champ label={t('Titre (EN, optionnel)', 'Title (EN, optional)')} value={titreEn} onChange={(e) => setTitreEn(e.target.value)} placeholder={t('Titre en anglais', 'English title')} />
          <Champ label={t('Lien ou ID YouTube (FR)', 'YouTube link or ID (FR)')} value={youtube} onChange={(e) => setYoutube(e.target.value)} placeholder="https://youtu.be/… ou N02OornOh7k" />
          <Champ label={t('Lien ou ID YouTube (EN, optionnel)', 'YouTube link or ID (EN, optional)')} value={youtubeEn} onChange={(e) => setYoutubeEn(e.target.value)} placeholder="https://youtu.be/…" />
          <Champ label={t('Ordre d’affichage', 'Display order')} type="number" value={ordre} onChange={(e) => setOrdre(e.target.value)} placeholder="0" />
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={envoi}
              className="rounded-md border border-[#d7dce3] px-4 py-2 font-sans text-[14px] font-bold text-knavy disabled:opacity-50"
            >
              {t('Enregistrer en brouillon', 'Save as draft')}
            </button>
            <button
              type="button"
              disabled={envoi}
              onClick={(e) => soumettre(e, true)}
              className="rounded-md bg-kgreen px-4 py-2 font-sans text-[14px] font-bold text-white disabled:opacity-50"
            >
              {envoi ? '…' : t('Publier', 'Publish')}
            </button>
          </div>
        </form>
      </Carte>

      <Carte className="flex-1 basis-[420px]">
        {chargement ? (
          <Chargement />
        ) : liste.length === 0 ? (
          <EtatVide>{t('Aucune vidéo.', 'No videos.')}</EtatVide>
        ) : (
          <>
            <div className="border-b border-[#f1f3f6] px-5 py-[10px] font-sans text-[12px] text-kfaint">
              {t('Glissez les vidéos pour modifier leur ordre d’affichage.', 'Drag the videos to change their display order.')}
            </div>
            {liste.map((v, i) => (
              <div
                key={v.id}
                onDragOver={(e) => {
                  e.preventDefault()
                  if (survol !== i) setSurvol(i)
                }}
                onDrop={() => deposer(i)}
                className={`flex flex-wrap items-center gap-3 border-b border-[#f1f3f6] px-5 py-[14px] last:border-b-0 ${
                  dragIndex === i ? 'opacity-40' : ''
                } ${survol === i && dragIndex !== null && dragIndex !== i ? 'bg-kgreen/5' : ''}`}
              >
                <button
                  type="button"
                  draggable
                  onDragStart={() => setDragIndex(i)}
                  onDragEnd={() => {
                    setDragIndex(null)
                    setSurvol(null)
                  }}
                  aria-label={t('Glisser pour réordonner', 'Drag to reorder')}
                  title={t('Glisser pour réordonner', 'Drag to reorder')}
                  className="flex-none cursor-grab select-none px-1 text-[18px] leading-none text-kfaint active:cursor-grabbing"
                >
                  ⠿
                </button>
                <img
                  src={`https://i.ytimg.com/vi/${v.youtube_id}/default.jpg`}
                  alt=""
                  className="h-[34px] w-[60px] flex-none rounded object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-sans text-[15px] font-semibold text-knavy">{v.titre}</div>
                  <div className="mt-1 font-sans text-[12px] text-kfaint">
                    {t('Ordre', 'Order')} {v.ordre} · {v.youtube_id}
                  </div>
                </div>
                <PastillePublie publie={v.publie} />
                <BoutonsLigne
                  publie={v.publie}
                  busy={busy === v.id}
                  onPublier={() => basculer(v)}
                  onSupprimer={() => supprimer(v)}
                />
              </div>
            ))}
          </>
        )}
      </Carte>
    </div>
  )
}

// --- Thèmes du programme ----------------------------------------------------

const COULEURS_PROGRAMME = [
  ['kgreen', { fr: 'Vert', en: 'Green' }, 'bg-kgreen'],
  ['kred', { fr: 'Rouge', en: 'Red' }, 'bg-kred'],
  ['kgold', { fr: 'Or', en: 'Gold' }, 'bg-kgold'],
  ['knavy', { fr: 'Bleu nuit', en: 'Navy' }, 'bg-knavy'],
]
const PASTILLE_COULEUR = Object.fromEntries(COULEURS_PROGRAMME.map(([cle, , cls]) => [cle, cls]))

function SectionProgramme() {
  const t = useLang().t
  const [liste, setListe] = useState([])
  const [chargement, setChargement] = useState(true)
  const [busy, setBusy] = useState(null)

  const [titre, setTitre] = useState('')
  const [titreEn, setTitreEn] = useState('')
  const [couleur, setCouleur] = useState('kgreen')
  const [points, setPoints] = useState('')
  const [pointsEn, setPointsEn] = useState('')
  const [ordre, setOrdre] = useState('')
  const [envoi, setEnvoi] = useState(false)
  const [erreur, setErreur] = useState('')
  const [dragIndex, setDragIndex] = useState(null)
  const [survol, setSurvol] = useState(null)

  const charger = () =>
    listerProgrammeThemesAdmin()
      .then(setListe)
      .catch(() => {})
      .finally(() => setChargement(false))
  useEffect(() => {
    charger()
  }, [])

  const soumettre = async (e, publier) => {
    e.preventDefault()
    setErreur('')
    if (!titre.trim()) {
      setErreur(t('Le titre est obligatoire.', 'The title is required.'))
      return
    }
    setEnvoi(true)
    try {
      await creerProgrammeTheme({
        titre: titre.trim(),
        titre_en: titreEn.trim(),
        couleur,
        points: lignesEnPoints(points),
        points_en: lignesEnPoints(pointsEn),
        ordre: ordre.trim() === '' ? 0 : parseInt(ordre, 10),
        publie: publier,
      })
      setTitre('')
      setTitreEn('')
      setCouleur('kgreen')
      setPoints('')
      setPointsEn('')
      setOrdre('')
      await charger()
    } catch (e2) {
      setErreur(e2?.message || t('Échec de la création.', 'Creation failed.'))
    } finally {
      setEnvoi(false)
    }
  }

  const basculer = async (th) => {
    setBusy(th.id)
    try {
      await basculerPublicationProgrammeTheme(th.id, !th.publie)
      setListe((prev) => prev.map((x) => (x.id === th.id ? { ...x, publie: !th.publie } : x)))
    } catch (e) {
      alert(e?.message || t('Échec.', 'Failed.'))
    } finally {
      setBusy(null)
    }
  }

  const supprimer = async (th) => {
    if (!window.confirm(t(`Supprimer définitivement « ${th.titre} » ?`, `Permanently delete “${th.titre}”?`))) return
    setBusy(th.id)
    try {
      await supprimerProgrammeTheme(th.id)
      setListe((prev) => prev.filter((x) => x.id !== th.id))
    } catch (e) {
      alert(e?.message || t('Échec.', 'Failed.'))
    } finally {
      setBusy(null)
    }
  }

  const deposer = async (cible) => {
    const source = dragIndex
    setDragIndex(null)
    setSurvol(null)
    if (source === null || source === cible) return
    const avant = liste
    const reordonnee = [...liste]
    const [deplace] = reordonnee.splice(source, 1)
    reordonnee.splice(cible, 0, deplace)
    const avecOrdre = reordonnee.map((th, i) => ({ ...th, ordre: i + 1 }))
    setListe(avecOrdre)
    try {
      await reordonnerProgrammeThemes(avecOrdre.map((th) => th.id))
    } catch (e) {
      setListe(avant)
      alert(e?.message || t('Échec du réordonnancement.', 'Reordering failed.'))
    }
  }

  return (
    <div className="flex flex-wrap items-start gap-6">
      <Carte className="flex-1 basis-[340px]">
        <form onSubmit={(e) => soumettre(e, false)} className="flex flex-col gap-4 p-5">
          <div className="font-sans text-[13px] font-bold uppercase tracking-[0.08em] text-knavy">
            {t('Nouveau thème', 'New theme')}
          </div>
          {erreur && <div className="font-sans text-[13px] text-kred">{erreur}</div>}
          <Champ label={t('Titre (FR)', 'Title (FR)')} value={titre} onChange={(e) => setTitre(e.target.value)} placeholder={t('Titre du thème', 'Theme title')} />
          <Champ label={t('Titre (EN, optionnel)', 'Title (EN, optional)')} value={titreEn} onChange={(e) => setTitreEn(e.target.value)} placeholder={t('Titre en anglais', 'English title')} />
          <ChampSelect label={t('Couleur', 'Colour')} value={couleur} onChange={(e) => setCouleur(e.target.value)}>
            {COULEURS_PROGRAMME.map(([cle, lbl]) => (
              <option key={cle} value={cle}>
                {t(lbl)}
              </option>
            ))}
          </ChampSelect>
          <ChampZone label={t('Propositions (FR — une par ligne)', 'Proposals (FR — one per line)')} value={points} onChange={(e) => setPoints(e.target.value)} placeholder={t('Une proposition par ligne…', 'One proposal per line…')} />
          <ChampZone label={t('Propositions (EN, optionnel — une par ligne)', 'Proposals (EN, optional — one per line)')} value={pointsEn} onChange={(e) => setPointsEn(e.target.value)} placeholder={t('Une proposition par ligne…', 'One proposal per line…')} />
          <Champ label={t('Ordre d’affichage', 'Display order')} type="number" value={ordre} onChange={(e) => setOrdre(e.target.value)} placeholder="0" />
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={envoi}
              className="rounded-md border border-[#d7dce3] px-4 py-2 font-sans text-[14px] font-bold text-knavy disabled:opacity-50"
            >
              {t('Enregistrer en brouillon', 'Save as draft')}
            </button>
            <button
              type="button"
              disabled={envoi}
              onClick={(e) => soumettre(e, true)}
              className="rounded-md bg-kgreen px-4 py-2 font-sans text-[14px] font-bold text-white disabled:opacity-50"
            >
              {envoi ? '…' : t('Publier', 'Publish')}
            </button>
          </div>
        </form>
      </Carte>

      <Carte className="flex-1 basis-[420px]">
        {chargement ? (
          <Chargement />
        ) : liste.length === 0 ? (
          <EtatVide>{t('Aucun thème.', 'No themes.')}</EtatVide>
        ) : (
          <>
            <div className="border-b border-[#f1f3f6] px-5 py-[10px] font-sans text-[12px] text-kfaint">
              {t('Glissez les thèmes pour modifier leur ordre d’affichage.', 'Drag the themes to change their display order.')}
            </div>
            {liste.map((th, i) => (
              <div
                key={th.id}
                onDragOver={(e) => {
                  e.preventDefault()
                  if (survol !== i) setSurvol(i)
                }}
                onDrop={() => deposer(i)}
                className={`flex flex-wrap items-center gap-3 border-b border-[#f1f3f6] px-5 py-[14px] last:border-b-0 ${
                  dragIndex === i ? 'opacity-40' : ''
                } ${survol === i && dragIndex !== null && dragIndex !== i ? 'bg-kgreen/5' : ''}`}
              >
                <button
                  type="button"
                  draggable
                  onDragStart={() => setDragIndex(i)}
                  onDragEnd={() => {
                    setDragIndex(null)
                    setSurvol(null)
                  }}
                  aria-label={t('Glisser pour réordonner', 'Drag to reorder')}
                  title={t('Glisser pour réordonner', 'Drag to reorder')}
                  className="flex-none cursor-grab select-none px-1 text-[18px] leading-none text-kfaint active:cursor-grabbing"
                >
                  ⠿
                </button>
                <span className={`h-[14px] w-[14px] flex-none rounded-full ${PASTILLE_COULEUR[th.couleur] || 'bg-knavy'}`} />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-sans text-[15px] font-semibold text-knavy">{th.titre}</div>
                  <div className="mt-1 font-sans text-[12px] text-kfaint">
                    {t('Ordre', 'Order')} {th.ordre} · {(th.points?.length ?? 0)} {t('propositions', 'proposals')}
                  </div>
                </div>
                <PastillePublie publie={th.publie} />
                <BoutonsLigne
                  publie={th.publie}
                  busy={busy === th.id}
                  onPublier={() => basculer(th)}
                  onSupprimer={() => supprimer(th)}
                />
              </div>
            ))}
          </>
        )}
      </Carte>
    </div>
  )
}

// --- Bibliothèque de documents (Ressources) ---------------------------------

function SectionRessources() {
  const t = useLang().t
  const [liste, setListe] = useState([])
  const [chargement, setChargement] = useState(true)
  const [busy, setBusy] = useState(null)

  const [titre, setTitre] = useState('')
  const [titreEn, setTitreEn] = useState('')
  const [mode, setMode] = useState('url') // 'url' = lien externe, 'fichier' = téléversement
  const [url, setUrl] = useState('')
  const [fichier, setFichier] = useState(null)
  const [ordre, setOrdre] = useState('')
  const [envoi, setEnvoi] = useState(false)
  const [erreur, setErreur] = useState('')
  const [dragIndex, setDragIndex] = useState(null)
  const [survol, setSurvol] = useState(null)
  const inputFichier = useRef(null)

  const charger = () =>
    listerRessourcesAdmin()
      .then(setListe)
      .catch(() => {})
      .finally(() => setChargement(false))
  useEffect(() => {
    charger()
  }, [])

  const reinitialiser = () => {
    setTitre('')
    setTitreEn('')
    setUrl('')
    setFichier(null)
    setOrdre('')
    if (inputFichier.current) inputFichier.current.value = ''
  }

  const soumettre = async (e, publier) => {
    e.preventDefault()
    setErreur('')
    if (!titre.trim()) {
      setErreur(t('Le titre est obligatoire.', 'The title is required.'))
      return
    }
    if (mode === 'url' && !url.trim()) {
      setErreur(t('Le lien du document est obligatoire.', 'The document link is required.'))
      return
    }
    if (mode === 'fichier' && !fichier) {
      setErreur(t('Sélectionnez un fichier à téléverser.', 'Select a file to upload.'))
      return
    }
    setEnvoi(true)
    try {
      let storage_path = null
      if (mode === 'fichier') {
        storage_path = await televerserDocumentRessource(fichier)
      }
      await creerRessource({
        titre: titre.trim(),
        titre_en: titreEn.trim(),
        url: mode === 'url' ? url.trim() : null,
        storage_path,
        ordre: ordre.trim() === '' ? 0 : parseInt(ordre, 10),
        publie: publier,
      })
      reinitialiser()
      await charger()
    } catch (e2) {
      setErreur(e2?.message || t('Échec de la création.', 'Creation failed.'))
    } finally {
      setEnvoi(false)
    }
  }

  const basculer = async (r) => {
    setBusy(r.id)
    try {
      await basculerPublicationRessource(r.id, !r.publie)
      setListe((prev) => prev.map((x) => (x.id === r.id ? { ...x, publie: !r.publie } : x)))
    } catch (e) {
      alert(e?.message || t('Échec.', 'Failed.'))
    } finally {
      setBusy(null)
    }
  }

  const supprimer = async (r) => {
    if (!window.confirm(t(`Supprimer définitivement « ${r.titre} » ?`, `Permanently delete “${r.titre}”?`))) return
    setBusy(r.id)
    try {
      await supprimerRessource(r)
      setListe((prev) => prev.filter((x) => x.id !== r.id))
    } catch (e) {
      alert(e?.message || t('Échec.', 'Failed.'))
    } finally {
      setBusy(null)
    }
  }

  const deposer = async (cible) => {
    const source = dragIndex
    setDragIndex(null)
    setSurvol(null)
    if (source === null || source === cible) return
    const avant = liste
    const reordonnee = [...liste]
    const [deplace] = reordonnee.splice(source, 1)
    reordonnee.splice(cible, 0, deplace)
    const avecOrdre = reordonnee.map((r, i) => ({ ...r, ordre: i + 1 }))
    setListe(avecOrdre)
    try {
      await reordonnerRessources(avecOrdre.map((r) => r.id))
    } catch (e) {
      setListe(avant)
      alert(e?.message || t('Échec du réordonnancement.', 'Reordering failed.'))
    }
  }

  const ongletMode = (cle, lbl) => (
    <button
      type="button"
      onClick={() => setMode(cle)}
      className={`flex-1 rounded px-3 py-[6px] font-sans text-[13px] font-bold ${
        mode === cle ? 'bg-kgreen text-white' : 'text-kink'
      }`}
    >
      {lbl}
    </button>
  )

  return (
    <div className="flex flex-wrap items-start gap-6">
      <Carte className="flex-1 basis-[340px]">
        <form onSubmit={(e) => soumettre(e, false)} className="flex flex-col gap-4 p-5">
          <div className="font-sans text-[13px] font-bold uppercase tracking-[0.08em] text-knavy">
            {t('Nouveau document', 'New document')}
          </div>
          {erreur && <div className="font-sans text-[13px] text-kred">{erreur}</div>}
          <Champ label={t('Titre (FR)', 'Title (FR)')} value={titre} onChange={(e) => setTitre(e.target.value)} placeholder={t('Titre du document', 'Document title')} />
          <Champ label={t('Titre (EN, optionnel)', 'Title (EN, optional)')} value={titreEn} onChange={(e) => setTitreEn(e.target.value)} placeholder={t('Titre en anglais', 'English title')} />

          <div>
            <span className="mb-1 block font-sans text-[12px] font-bold uppercase tracking-[0.05em] text-kfaint">
              {t('Source du document', 'Document source')}
            </span>
            <div className="flex rounded-md border border-[#d7dce3] p-1">
              {ongletMode('url', t('Lien externe', 'External link'))}
              {ongletMode('fichier', t('Téléverser (PDF)', 'Upload (PDF)'))}
            </div>
          </div>

          {mode === 'url' ? (
            <Champ label={t('Lien du document', 'Document link')} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />
          ) : (
            <label className="block">
              <span className="mb-1 block font-sans text-[12px] font-bold uppercase tracking-[0.05em] text-kfaint">
                {t('Fichier (PDF, DOC… — max 25 Mo)', 'File (PDF, DOC… — max 25 MB)')}
              </span>
              <input
                ref={inputFichier}
                type="file"
                accept=".pdf,.doc,.docx,.odt,application/pdf"
                onChange={(e) => setFichier(e.target.files?.[0] || null)}
                className="w-full font-sans text-[13px] text-knavy file:mr-3 file:rounded-md file:border-0 file:bg-kgreen file:px-3 file:py-2 file:font-sans file:text-[13px] file:font-bold file:text-white"
              />
            </label>
          )}

          <Champ label={t('Ordre d’affichage', 'Display order')} type="number" value={ordre} onChange={(e) => setOrdre(e.target.value)} placeholder="0" />
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={envoi}
              className="rounded-md border border-[#d7dce3] px-4 py-2 font-sans text-[14px] font-bold text-knavy disabled:opacity-50"
            >
              {t('Enregistrer en brouillon', 'Save as draft')}
            </button>
            <button
              type="button"
              disabled={envoi}
              onClick={(e) => soumettre(e, true)}
              className="rounded-md bg-kgreen px-4 py-2 font-sans text-[14px] font-bold text-white disabled:opacity-50"
            >
              {envoi ? '…' : t('Publier', 'Publish')}
            </button>
          </div>
        </form>
      </Carte>

      <Carte className="flex-1 basis-[420px]">
        {chargement ? (
          <Chargement />
        ) : liste.length === 0 ? (
          <EtatVide>{t('Aucun document.', 'No documents.')}</EtatVide>
        ) : (
          <>
            <div className="border-b border-[#f1f3f6] px-5 py-[10px] font-sans text-[12px] text-kfaint">
              {t('Glissez les documents pour modifier leur ordre d’affichage.', 'Drag the documents to change their display order.')}
            </div>
            {liste.map((r, i) => (
              <div
                key={r.id}
                onDragOver={(e) => {
                  e.preventDefault()
                  if (survol !== i) setSurvol(i)
                }}
                onDrop={() => deposer(i)}
                className={`flex flex-wrap items-center gap-3 border-b border-[#f1f3f6] px-5 py-[14px] last:border-b-0 ${
                  dragIndex === i ? 'opacity-40' : ''
                } ${survol === i && dragIndex !== null && dragIndex !== i ? 'bg-kgreen/5' : ''}`}
              >
                <button
                  type="button"
                  draggable
                  onDragStart={() => setDragIndex(i)}
                  onDragEnd={() => {
                    setDragIndex(null)
                    setSurvol(null)
                  }}
                  aria-label={t('Glisser pour réordonner', 'Drag to reorder')}
                  title={t('Glisser pour réordonner', 'Drag to reorder')}
                  className="flex-none cursor-grab select-none px-1 text-[18px] leading-none text-kfaint active:cursor-grabbing"
                >
                  ⠿
                </button>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-sans text-[15px] font-semibold text-knavy">{r.titre}</div>
                  <div className="mt-1 font-sans text-[12px] text-kfaint">
                    {t('Ordre', 'Order')} {r.ordre} · {r.storage_path ? t('Fichier téléversé', 'Uploaded file') : t('Lien externe', 'External link')}
                  </div>
                </div>
                <PastillePublie publie={r.publie} />
                <BoutonsLigne
                  publie={r.publie}
                  busy={busy === r.id}
                  onPublier={() => basculer(r)}
                  onSupprimer={() => supprimer(r)}
                />
              </div>
            ))}
          </>
        )}
      </Carte>
    </div>
  )
}
