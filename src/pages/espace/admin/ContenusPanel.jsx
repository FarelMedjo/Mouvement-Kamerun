import { useEffect, useState } from 'react'
import {
  listerActualitesAdmin,
  creerActualite,
  basculerPublicationActualite,
  supprimerActualite,
  listerEvenementsAdmin,
  creerEvenement,
  basculerPublicationEvenement,
  supprimerEvenement,
} from '../../../lib/admin'
import { formatDateLongue } from '../../../lib/dates'
import { PanelHeader, Carte, EtatVide, Chargement, Champ, ChampZone } from './ui'

// Gestion des contenus publics : créer et publier actualités et événements.
export default function ContenusPanel() {
  const [onglet, setOnglet] = useState('actualites')
  return (
    <div>
      <PanelHeader
        titre="Contenus publics"
        sousTitre="Créez et publiez les actualités et les événements visibles du public."
        actions={
          <div className="inline-flex rounded-md border border-[#d7dce3] p-1">
            {[
              ['actualites', 'Actualités'],
              ['evenements', 'Événements'],
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
      {onglet === 'actualites' ? <SectionActualites /> : <SectionEvenements />}
    </div>
  )
}

function BoutonsLigne({ publie, busy, onPublier, onSupprimer }) {
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
        {publie ? 'Dépublier' : 'Publier'}
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={onSupprimer}
        className="rounded-md border border-kred px-3 py-[7px] font-sans text-[13px] font-bold text-kred disabled:opacity-50"
      >
        Suppr.
      </button>
    </div>
  )
}

function PastillePublie({ publie }) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-[10px] py-[5px] font-sans text-[11px] font-bold ${
        publie ? 'bg-kgreen/10 text-kgreen' : 'bg-[#fff5d6] text-[#8a6d1a]'
      }`}
    >
      {publie ? 'Publié' : 'Brouillon'}
    </span>
  )
}

// --- Actualités -------------------------------------------------------------

function SectionActualites() {
  const [liste, setListe] = useState([])
  const [chargement, setChargement] = useState(true)
  const [busy, setBusy] = useState(null)

  const [titre, setTitre] = useState('')
  const [contenu, setContenu] = useState('')
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
      setErreur('Le titre est obligatoire.')
      return
    }
    setEnvoi(true)
    try {
      await creerActualite({ titre: titre.trim(), contenu, image_url: imageUrl, publie: publier })
      setTitre('')
      setContenu('')
      setImageUrl('')
      await charger()
    } catch (e2) {
      setErreur(e2?.message || 'Échec de la création.')
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
      alert(e?.message || 'Échec.')
    } finally {
      setBusy(null)
    }
  }

  const supprimer = async (a) => {
    if (!window.confirm(`Supprimer définitivement « ${a.titre} » ?`)) return
    setBusy(a.id)
    try {
      await supprimerActualite(a.id)
      setListe((prev) => prev.filter((x) => x.id !== a.id))
    } catch (e) {
      alert(e?.message || 'Échec.')
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
            Nouvelle actualité
          </div>
          {erreur && <div className="font-sans text-[13px] text-kred">{erreur}</div>}
          <Champ label="Titre" value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Titre de l'actualité" />
          <ChampZone label="Contenu" value={contenu} onChange={(e) => setContenu(e.target.value)} placeholder="Texte de l'actualité…" />
          <Champ label="Image (URL)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" />
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={envoi}
              className="rounded-md border border-[#d7dce3] px-4 py-2 font-sans text-[14px] font-bold text-knavy disabled:opacity-50"
            >
              Enregistrer en brouillon
            </button>
            <button
              type="button"
              disabled={envoi}
              onClick={(e) => soumettre(e, true)}
              className="rounded-md bg-kgreen px-4 py-2 font-sans text-[14px] font-bold text-white disabled:opacity-50"
            >
              {envoi ? '…' : 'Publier'}
            </button>
          </div>
        </form>
      </Carte>

      {/* Liste existante */}
      <Carte className="flex-1 basis-[420px]">
        {chargement ? (
          <Chargement />
        ) : liste.length === 0 ? (
          <EtatVide>Aucune actualité.</EtatVide>
        ) : (
          liste.map((a) => (
            <div
              key={a.id}
              className="flex flex-wrap items-center gap-3 border-b border-[#f1f3f6] px-5 py-[14px] last:border-b-0"
            >
              <div className="min-w-0 flex-1">
                <div className="truncate font-sans text-[15px] font-semibold text-knavy">{a.titre}</div>
                <div className="mt-1 font-sans text-[12px] text-kfaint">{formatDateLongue(a.created_at)}</div>
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
      setErreur('Le titre est obligatoire.')
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
      setErreur(e2?.message || 'Échec de la création.')
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
      alert(e?.message || 'Échec.')
    } finally {
      setBusy(null)
    }
  }

  const supprimer = async (ev) => {
    if (!window.confirm(`Supprimer définitivement « ${ev.titre} » ?`)) return
    setBusy(ev.id)
    try {
      await supprimerEvenement(ev.id)
      setListe((prev) => prev.filter((x) => x.id !== ev.id))
    } catch (e) {
      alert(e?.message || 'Échec.')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="flex flex-wrap items-start gap-6">
      <Carte className="flex-1 basis-[340px]">
        <form onSubmit={(e) => soumettre(e, false)} className="flex flex-col gap-4 p-5">
          <div className="font-sans text-[13px] font-bold uppercase tracking-[0.08em] text-knavy">
            Nouvel événement
          </div>
          {erreur && <div className="font-sans text-[13px] text-kred">{erreur}</div>}
          <Champ label="Titre" value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Titre de l'événement" />
          <ChampZone label="Description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description…" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Champ label="Lieu" value={lieu} onChange={(e) => setLieu(e.target.value)} placeholder="Ville, salle…" />
            <Champ label="Date et heure" type="datetime-local" value={dateEvent} onChange={(e) => setDateEvent(e.target.value)} />
          </div>
          <Champ label="Image (URL)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" />
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={envoi}
              className="rounded-md border border-[#d7dce3] px-4 py-2 font-sans text-[14px] font-bold text-knavy disabled:opacity-50"
            >
              Enregistrer en brouillon
            </button>
            <button
              type="button"
              disabled={envoi}
              onClick={(e) => soumettre(e, true)}
              className="rounded-md bg-kgreen px-4 py-2 font-sans text-[14px] font-bold text-white disabled:opacity-50"
            >
              {envoi ? '…' : 'Publier'}
            </button>
          </div>
        </form>
      </Carte>

      <Carte className="flex-1 basis-[420px]">
        {chargement ? (
          <Chargement />
        ) : liste.length === 0 ? (
          <EtatVide>Aucun événement.</EtatVide>
        ) : (
          liste.map((ev) => (
            <div
              key={ev.id}
              className="flex flex-wrap items-center gap-3 border-b border-[#f1f3f6] px-5 py-[14px] last:border-b-0"
            >
              <div className="min-w-0 flex-1">
                <div className="truncate font-sans text-[15px] font-semibold text-knavy">{ev.titre}</div>
                <div className="mt-1 font-sans text-[12px] text-kfaint">
                  {ev.date_event ? formatDateLongue(ev.date_event) : 'Date non précisée'}
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
