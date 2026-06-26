import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { formatDateLongue } from '../../lib/dates'
import {
  getMesDetails,
  enregistrerMesDetails,
  listerMesFichiers,
  televerserFichier,
  urlSignee,
  fichierAccepte,
  TAILLE_MAX_OCTETS,
} from '../../lib/scrutateur'

const TYPE_LABEL = { pv: 'PV / Doc', image: 'Image', audio: 'Audio', video: 'Vidéo', autre: 'Autre' }
const TYPE_BADGE = {
  pv: 'bg-knavy/10 text-knavy',
  image: 'bg-kgreen/10 text-kgreen',
  audio: 'bg-kred/10 text-kred',
  video: 'bg-[#b58f00]/10 text-[#b58f00]',
  autre: 'bg-black/5 text-kfaint',
}

function formatTaille(o) {
  if (!o && o !== 0) return ''
  if (o < 1024) return `${o} o`
  if (o < 1024 * 1024) return `${(o / 1024).toFixed(0)} Ko`
  return `${(o / 1024 / 1024).toFixed(1)} Mo`
}

export default function Dashboard() {
  const { user } = useAuth()
  const [details, setDetails] = useState(null)
  const [fichiers, setFichiers] = useState([])
  const [chargement, setChargement] = useState(true)
  const [dragActif, setDragActif] = useState(false)
  const [enCours, setEnCours] = useState([]) // [{ nom, etat, message }]
  const inputRef = useRef(null)

  const rafraichir = useCallback(async () => {
    const [d, fs] = await Promise.all([
      getMesDetails().catch(() => null),
      listerMesFichiers().catch(() => []),
    ])
    setDetails(d)
    setFichiers(fs)
    setChargement(false)
  }, [])

  useEffect(() => {
    rafraichir()
  }, [rafraichir])

  const bureau = details?.bureau_vote || null

  // --- Téléversement -------------------------------------------------------
  const traiterFichiers = useCallback(
    async (liste) => {
      const items = Array.from(liste)
      if (!items.length) return
      // Pré-validation visuelle.
      setEnCours(items.map((file) => ({ nom: file.name, etat: 'en_cours', message: '' })))

      for (let i = 0; i < items.length; i++) {
        const file = items[i]
        try {
          if (!fichierAccepte(file)) throw new Error('Type non accepté.')
          if (file.size > TAILLE_MAX_OCTETS) throw new Error('Trop volumineux (max 50 Mo).')
          await televerserFichier({ file, bureau })
          setEnCours((prev) => prev.map((x, j) => (j === i ? { ...x, etat: 'ok' } : x)))
        } catch (err) {
          setEnCours((prev) =>
            prev.map((x, j) => (j === i ? { ...x, etat: 'erreur', message: err?.message || 'Échec' } : x))
          )
        }
      }
      await rafraichir()
      // Nettoie les lignes en succès après un court délai.
      setTimeout(() => setEnCours((prev) => prev.filter((x) => x.etat !== 'ok')), 4000)
    },
    [bureau, rafraichir]
  )

  const onDrop = (e) => {
    e.preventDefault()
    setDragActif(false)
    traiterFichiers(e.dataTransfer.files)
  }

  const telecharger = async (path) => {
    try {
      const url = await urlSignee(path)
      window.open(url, '_blank', 'noopener')
    } catch (err) {
      alert(err?.message || "Impossible de générer le lien de téléchargement.")
    }
  }

  return (
    <>
      {/* bandeau d'accueil */}
      <div className="bg-kgreen px-[clamp(16px,5vw,40px)] py-[clamp(22px,3vw,30px)]">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="m-0 font-heading text-[clamp(26px,4vw,38px)] font-bold uppercase leading-none text-white">
              Tableau de bord
            </h1>
            <p className="m-0 mt-[6px] font-sans text-[14px] leading-[1.5] text-[#d7ece1]">
              Transmettez les documents de votre bureau de vote en toute sécurité.
            </p>
          </div>
          <div className="flex flex-wrap gap-[10px]">
            <div className="rounded-md bg-white/10 px-[18px] py-3">
              <div className="font-heading text-[22px] font-bold leading-none text-kgold">{fichiers.length}</div>
              <div className="mt-1 font-sans text-[11px] font-semibold uppercase tracking-[0.06em] leading-none text-[#e6f1ea]">fichiers transmis</div>
            </div>
            <div className="rounded-md bg-white/10 px-[18px] py-3">
              <div className="font-heading text-[22px] font-bold leading-none text-white">{bureau || '—'}</div>
              <div className="mt-1 font-sans text-[11px] font-semibold uppercase tracking-[0.06em] leading-none text-[#e6f1ea]">bureau affecté</div>
            </div>
          </div>
        </div>
      </div>

      <section className="px-[clamp(16px,5vw,40px)] py-[clamp(28px,4vw,44px)]">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-start gap-[clamp(22px,3vw,32px)]">

          {/* colonne téléversement */}
          <div className="flex-1 basis-[360px]">
            {/* rappel d'affectation / complétion si manquante */}
            {!chargement && !details && <CompleterAffectation onSaved={rafraichir} />}

            <div className="mb-[14px] font-sans text-[13px] font-bold uppercase tracking-[0.08em] leading-none text-knavy">
              Téléverser des fichiers
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragActif(true) }}
              onDragLeave={() => setDragActif(false)}
              onDrop={onDrop}
              className={`rounded-lg border-2 border-dashed p-[clamp(24px,4vw,40px)] text-center transition-colors ${
                dragActif ? 'border-kgreen bg-kgreen/[0.05]' : 'border-[#cdd6e0] bg-[#fafbfc]'
              }`}
            >
              <div className="mx-auto mb-[18px] flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf3ee] text-[30px] leading-none text-kgreen">⬆</div>
              <div className="mb-2 font-heading text-[20px] font-bold uppercase tracking-[0.02em] leading-[1.1] text-knavy">
                Glissez-déposez vos fichiers ici
              </div>
              <p className="m-0 mb-[18px] font-sans text-[14px] leading-[1.5] text-[#56607a]">
                Procès-verbaux (PDF, Word), images, audio et vidéo acceptés.
              </p>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="rounded-md bg-kgreen px-6 py-[14px] font-sans text-[15px] font-bold leading-none text-white"
              >
                Parcourir les fichiers
              </button>
              <input
                ref={inputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,image/*,audio/*,video/*"
                onChange={(e) => { traiterFichiers(e.target.files); e.target.value = '' }}
                className="hidden"
              />
            </div>

            {/* types acceptés */}
            <div className="mt-4 flex flex-wrap gap-[10px]">
              {[['PV / Documents', 'bg-knavy'], ['Images', 'bg-kgreen'], ['Audio', 'bg-kred'], ['Vidéo', 'bg-[#b58f00]']].map(([lbl, dot]) => (
                <span key={lbl} className="inline-flex items-center gap-[7px] rounded-full border border-[#e3e7ec] bg-white px-[14px] py-2 font-sans text-[13px] font-semibold leading-none text-[#56607a]">
                  <span className={`h-2 w-2 rounded-full ${dot}`} />
                  {lbl}
                </span>
              ))}
            </div>

            {/* file d'attente / résultats du téléversement */}
            {enCours.length > 0 && (
              <div className="mt-4 flex flex-col gap-2">
                {enCours.map((x, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 rounded-md border border-[#e3e7ec] bg-white px-4 py-3">
                    <span className="min-w-0 flex-1 truncate font-sans text-[14px] text-knavy">{x.nom}</span>
                    {x.etat === 'en_cours' && <span className="font-sans text-[13px] font-semibold text-kfaint">Envoi…</span>}
                    {x.etat === 'ok' && <span className="font-sans text-[13px] font-bold text-kgreen">✓ Transmis</span>}
                    {x.etat === 'erreur' && <span className="font-sans text-[13px] font-bold text-kred" title={x.message}>✗ {x.message}</span>}
                  </div>
                ))}
              </div>
            )}

            {/* mention de sécurité */}
            <div className="mt-[18px] flex items-start gap-3 rounded-lg border border-[#cfe6da] bg-[#eaf3ee] px-5 py-[18px]">
              <span className="flex-none text-[20px] leading-[1.2] text-kgreen">🔒</span>
              <p className="m-0 font-sans text-[14px] font-semibold leading-[1.6] text-[#1f5b41]">
                Vos fichiers sont transmis de façon sécurisée et reçus uniquement par les
                administrateurs.
              </p>
            </div>
          </div>

          {/* colonne historique */}
          <div className="flex-1 basis-[340px]">
            <div className="mb-[14px] font-sans text-[13px] font-bold uppercase tracking-[0.08em] leading-none text-knavy">
              Fichiers déjà transmis
            </div>
            <div className="overflow-hidden rounded-lg border border-[#e3e7ec] bg-white">
              <div className="flex items-center gap-3 border-b border-kline bg-[#f7f9fb] px-[18px] py-3 font-sans text-[11px] font-bold uppercase tracking-[0.06em] leading-none text-[#9aa6bf]">
                <span className="flex-1">Fichier</span>
                <span className="w-[88px] flex-none">Type</span>
                <span className="w-[96px] flex-none text-right">Action</span>
              </div>

              {chargement ? (
                <div className="px-[18px] py-7 text-center font-sans text-[14px] text-[#9aa6bf]">Chargement…</div>
              ) : fichiers.length === 0 ? (
                <div className="px-[18px] py-7 text-center font-sans text-[14px] text-[#9aa6bf]">
                  Aucun fichier transmis pour le moment.
                </div>
              ) : (
                fichiers.map((f) => {
                  const nom = f.storage_path.split('/').slice(1).join('/').replace(/^\d+-/, '')
                  return (
                    <div key={f.id} className="flex items-center gap-3 border-b border-[#f1f3f6] px-[18px] py-[14px] last:border-b-0">
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-sans text-[15px] font-semibold leading-[1.3] text-knavy">{nom}</div>
                        <div className="mt-1 font-sans text-[12px] leading-none text-[#9aa6bf]">
                          {formatDateLongue(f.created_at)} · {formatTaille(f.taille_octets)}
                        </div>
                      </div>
                      <span className="w-[88px] flex-none">
                        <span className={`inline-block rounded-full px-[10px] py-[5px] font-sans text-[11px] font-bold ${TYPE_BADGE[f.type] || TYPE_BADGE.autre}`}>
                          {TYPE_LABEL[f.type] || 'Autre'}
                        </span>
                      </span>
                      <span className="w-[96px] flex-none text-right">
                        <button type="button" onClick={() => telecharger(f.storage_path)} className="font-sans text-[13px] font-bold text-kgreen">
                          Voir ↗
                        </button>
                      </span>
                    </div>
                  )
                })
              )}
            </div>
            <p className="mt-3 font-sans text-[12px] leading-[1.5] text-kfaint">
              Connecté : {user?.email}. Vous ne voyez que vos propres fichiers.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

// Petit formulaire de complétion du bureau d'affectation, affiché si les
// détails du scrutateur sont absents (robustesse).
function CompleterAffectation({ onSaved }) {
  const [bureau, setBureau] = useState('')
  const [region, setRegion] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    try {
      await enregistrerMesDetails({ region: region || null, bureau_vote: bureau || null })
      await onSaved()
    } catch (e2) {
      setErr(e2?.message || 'Échec de l\'enregistrement.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="mb-5 rounded-lg border border-[#f0d9a8] bg-[#fff8e8] p-4">
      <div className="mb-2 font-sans text-[13px] font-bold text-[#8a6d1a]">Complétez votre affectation</div>
      <p className="m-0 mb-3 font-sans text-[13px] leading-[1.5] text-[#7c6a3a]">
        Indiquez votre bureau de vote pour rattacher vos transmissions.
      </p>
      {err && <div className="mb-2 font-sans text-[13px] text-kred">{err}</div>}
      <div className="flex flex-wrap gap-2">
        <input value={region} onChange={(e) => setRegion(e.target.value)} placeholder="Région" className="min-w-[120px] flex-1 rounded-md border border-[#d7dce3] px-3 py-2 font-sans text-[14px] outline-none" />
        <input value={bureau} onChange={(e) => setBureau(e.target.value)} placeholder="Bureau de vote" className="min-w-[140px] flex-1 rounded-md border border-[#d7dce3] px-3 py-2 font-sans text-[14px] outline-none" />
        <button type="submit" disabled={loading} className="rounded-md bg-kgreen px-4 py-2 font-sans text-[14px] font-bold text-white disabled:opacity-60">
          {loading ? '…' : 'Enregistrer'}
        </button>
      </div>
    </form>
  )
}
