import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, ROLES } from '../../auth/AuthContext'
import {
  SECTEURS,
  getMesDetails,
  enregistrerMesDetails,
  ajouterRoleScrutateur,
  declareScrutateur,
} from '../../lib/benevole'
import { enregistrerMesDetails as enregistrerDetailsScrutateur } from '../../lib/scrutateur'
import { REGIONS } from '../../config/site'
import { useLang } from '../../i18n/LanguageContext'

// valeur -> label bilingue ({ fr, en }), résolu à l'affichage via le helper.
const SECTEUR_LABEL = Object.fromEntries(SECTEURS.map((s) => [s.valeur, s.label]))

const champ =
  'w-full rounded-md border border-[#d7dce3] px-4 py-[13px] font-sans text-[15px] leading-none text-knavy outline-none focus:border-kgreen bg-white'

export default function BenevoleDashboard() {
  const t = useLang().t
  const { user, hasRole } = useAuth()
  const [details, setDetails] = useState(null)
  const [chargement, setChargement] = useState(true)
  const [edition, setEdition] = useState(false)

  const rafraichir = useCallback(async () => {
    const d = await getMesDetails().catch(() => null)
    setDetails(d)
    setChargement(false)
  }, [])

  useEffect(() => {
    rafraichir()
  }, [rafraichir])

  const secteurs = details?.secteurs ?? []
  const estScrutateur = hasRole(ROLES.SCRUTATEUR)
  const proposerScrutateur = declareScrutateur(secteurs) && !estScrutateur

  return (
    <>
      {/* bandeau d'accueil */}
      <div className="bg-kgreen px-[clamp(16px,5vw,40px)] py-[clamp(22px,3vw,30px)]">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="m-0 font-heading text-[clamp(26px,4vw,38px)] font-bold uppercase leading-none text-white">
              {t('Tableau de bord', 'Dashboard')}
            </h1>
            <p className="m-0 mt-[6px] font-sans text-[14px] leading-[1.5] text-[#d7ece1]">
              {t("Gérez vos secteurs d'intervention, votre zone et vos disponibilités.", 'Manage your areas of involvement, your zone and your availability.')}
            </p>
          </div>
          <div className="flex flex-wrap gap-[10px]">
            <div className="rounded-md bg-white/10 px-[18px] py-3">
              <div className="font-heading text-[22px] font-bold leading-none text-kgold">{secteurs.length}</div>
              <div className="mt-1 font-sans text-[11px] font-semibold uppercase tracking-[0.06em] leading-none text-[#e6f1ea]">{t('secteurs déclarés', 'areas declared')}</div>
            </div>
            <div className="rounded-md bg-white/10 px-[18px] py-3">
              <div className="font-heading text-[22px] font-bold leading-none text-white">{details?.zone || '—'}</div>
              <div className="mt-1 font-sans text-[11px] font-semibold uppercase tracking-[0.06em] leading-none text-[#e6f1ea]">{t('zone', 'zone')}</div>
            </div>
          </div>
        </div>
      </div>

      <section className="px-[clamp(16px,5vw,40px)] py-[clamp(28px,4vw,44px)]">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-start gap-[clamp(22px,3vw,32px)]">

          {/* colonne profil bénévole */}
          <div className="flex-1 basis-[360px]">
            <div className="mb-[14px] flex items-center justify-between">
              <div className="font-sans text-[13px] font-bold uppercase tracking-[0.08em] leading-none text-knavy">
                {t('Mon engagement bénévole', 'My volunteer commitment')}
              </div>
              {!chargement && details && !edition && (
                <button type="button" onClick={() => setEdition(true)} className="font-sans text-[13px] font-bold text-kgreen">
                  {t('Modifier', 'Edit')}
                </button>
              )}
            </div>

            {chargement ? (
              <div className="rounded-lg border border-[#e3e7ec] bg-white px-5 py-7 text-center font-sans text-[14px] text-[#9aa6bf]">
                {t('Chargement…', 'Loading…')}
              </div>
            ) : edition || !details ? (
              <FormulaireDetails
                initial={details}
                onSaved={async () => { await rafraichir(); setEdition(false) }}
                onCancel={details ? () => setEdition(false) : null}
              />
            ) : (
              <div className="overflow-hidden rounded-lg border border-[#e3e7ec] bg-white">
                <Ligne libelle={t('Zone géographique', 'Geographic area')} valeur={details.zone || '—'} />
                <Ligne libelle={t('Disponibilités', 'Availability')} valeur={details.disponibilites || '—'} />
                <div className="px-[18px] py-[14px]">
                  <div className="mb-2 font-sans text-[11px] font-bold uppercase tracking-[0.06em] leading-none text-[#9aa6bf]">{t('Secteurs', 'Areas')}</div>
                  {secteurs.length ? (
                    <div className="flex flex-wrap gap-2">
                      {secteurs.map((s) => (
                        <span key={s} className="inline-block rounded-full bg-kgreen/10 px-[12px] py-[6px] font-sans text-[13px] font-bold text-kgreen">
                          {SECTEUR_LABEL[s] ? t(SECTEUR_LABEL[s]) : s}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="font-sans text-[14px] text-[#9aa6bf]">—</span>
                  )}
                </div>
              </div>
            )}

            <p className="mt-3 font-sans text-[12px] leading-[1.5] text-kfaint">
              {t('Connecté :', 'Signed in:')} {user?.email}.
            </p>
          </div>

          {/* colonne activation scrutateur / aide */}
          <div className="flex-1 basis-[340px]">
            {proposerScrutateur ? (
              <ActivationScrutateur onActive={rafraichir} />
            ) : estScrutateur ? (
              <div className="rounded-lg border border-[#cfe6da] bg-[#eaf3ee] px-5 py-[18px]">
                <div className="mb-1 font-sans text-[14px] font-bold text-[#1f5b41]">{t('Compte scrutateur actif', 'Poll watcher account active')}</div>
                <p className="m-0 mb-3 font-sans text-[14px] leading-[1.6] text-[#1f5b41]">
                  {t('Vous disposez des droits de téléversement des documents électoraux.', 'You have upload rights for electoral documents.')}
                </p>
                <a href="/scrutateurs/tableau-de-bord" className="inline-block rounded-md bg-kgreen px-4 py-[11px] font-sans text-[14px] font-bold text-white no-underline">
                  {t("Ouvrir l'espace scrutateur ↗", 'Open the poll watcher area ↗')}
                </a>
              </div>
            ) : (
              <div className="rounded-lg border border-[#e3e7ec] bg-white px-5 py-[18px]">
                <div className="mb-1 font-sans text-[14px] font-bold text-knavy">{t('Merci de votre engagement', 'Thank you for your commitment')}</div>
                <p className="m-0 font-sans text-[14px] leading-[1.6] text-[#56607a]">
                  {t(
                    'La coordination du mouvement vous contactera selon vos secteurs et vos disponibilités. Pensez à tenir vos informations à jour.',
                    'The movement’s coordination will contact you based on your areas and availability. Remember to keep your information up to date.',
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

function Ligne({ libelle, valeur }) {
  return (
    <div className="border-b border-[#f1f3f6] px-[18px] py-[14px]">
      <div className="mb-1 font-sans text-[11px] font-bold uppercase tracking-[0.06em] leading-none text-[#9aa6bf]">{libelle}</div>
      <div className="font-sans text-[15px] leading-[1.4] text-knavy">{valeur}</div>
    </div>
  )
}

// Formulaire de saisie / mise à jour des détails du bénévole. Sert aussi de
// complétion lorsqu'aucune ligne n'existe encore (robustesse).
function FormulaireDetails({ initial, onSaved, onCancel }) {
  const t = useLang().t
  const [zone, setZone] = useState(initial?.zone || '')
  const [disponibilites, setDisponibilites] = useState(initial?.disponibilites || '')
  const [secteurs, setSecteurs] = useState(initial?.secteurs ?? [])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const toggle = (v) =>
    setSecteurs((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]))

  const onSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    if (secteurs.length === 0) return setErr(t('Sélectionnez au moins un secteur.', 'Select at least one area.'))
    setLoading(true)
    try {
      await enregistrerMesDetails({ zone, disponibilites, secteurs })
      await onSaved()
    } catch (e2) {
      setErr(e2?.message || t("Échec de l'enregistrement.", 'Save failed.'))
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-[#e3e7ec] bg-white p-5">
      {err && <div className="mb-3 font-sans text-[13px] text-kred">{err}</div>}

      <label className="mb-1 block font-sans text-[12px] font-bold uppercase tracking-[0.06em] text-[#9aa6bf]">{t('Zone géographique', 'Geographic area')}</label>
      <input value={zone} onChange={(e) => setZone(e.target.value)} placeholder={t('Ex. Centre · Yaoundé', 'E.g. Centre · Yaoundé')} className={`${champ} mb-4`} />

      <label className="mb-1 block font-sans text-[12px] font-bold uppercase tracking-[0.06em] text-[#9aa6bf]">{t('Disponibilités', 'Availability')}</label>
      <textarea rows={2} value={disponibilites} onChange={(e) => setDisponibilites(e.target.value)} placeholder={t('Ex. Week-ends, soirées en semaine…', 'E.g. Weekends, weekday evenings…')} className={`${champ} mb-4 resize-y leading-[1.5]`} />

      <div className="mb-2 font-sans text-[12px] font-bold uppercase tracking-[0.06em] text-[#9aa6bf]">{t('Secteurs', 'Areas')}</div>
      <div className="mb-4 flex flex-col gap-2">
        {SECTEURS.map((s) => (
          <label key={s.valeur} className={`flex cursor-pointer items-center gap-3 rounded-md border p-[10px] ${secteurs.includes(s.valeur) ? 'border-kgreen bg-kgreen/[0.06]' : 'border-[#d7dce3]'}`}>
            <input type="checkbox" checked={secteurs.includes(s.valeur)} onChange={() => toggle(s.valeur)} className="h-[17px] w-[17px] flex-none accent-kgreen" />
            <span className="font-sans text-[14px] font-semibold text-knavy">{t(s.label)}</span>
          </label>
        ))}
      </div>

      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="rounded-md bg-kgreen px-5 py-[11px] font-sans text-[14px] font-bold text-white disabled:opacity-60">
          {loading ? t('Enregistrement…', 'Saving…') : t('Enregistrer', 'Save')}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-md border border-[#d7dce3] px-5 py-[11px] font-sans text-[14px] font-bold text-[#56607a]">
            {t('Annuler', 'Cancel')}
          </button>
        )}
      </div>
    </form>
  )
}

// Panneau d'activation du compte scrutateur, proposé au bénévole qui a déclaré
// le secteur « scrutateur ». Ajoute le rôle scrutateur (droits de téléversement)
// et enregistre le bureau d'affectation, puis ouvre l'espace scrutateur.
function ActivationScrutateur({ onActive }) {
  const t = useLang().t
  const { refreshRoles } = useAuth()
  const navigate = useNavigate()
  const [ouvert, setOuvert] = useState(false)
  const [f, setF] = useState({ region: '', departement: '', arrondissement: '', bureau_vote: '' })
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }))

  const activer = async (e) => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    try {
      await ajouterRoleScrutateur()
      // Enregistre le bureau d'affectation (facultatif mais utile dès l'activation).
      await enregistrerDetailsScrutateur({
        region: f.region || null,
        departement: f.departement.trim() || null,
        arrondissement: f.arrondissement.trim() || null,
        bureau_vote: f.bureau_vote.trim() || null,
      }).catch(() => {})
      await refreshRoles()
      if (onActive) await onActive()
      navigate('/scrutateurs/tableau-de-bord', { replace: true })
    } catch (e2) {
      setErr(e2?.message || t("Échec de l'activation.", 'Activation failed.'))
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border border-[#f0d9a8] bg-[#fff8e8] p-5">
      <div className="mb-1 font-sans text-[14px] font-bold text-[#8a6d1a]">{t('Activer mon compte scrutateur', 'Activate my poll watcher account')}</div>
      <p className="m-0 mb-3 font-sans text-[14px] leading-[1.6] text-[#7c6a3a]">
        {t(
          'Vous avez déclaré le secteur scrutateur. Activez votre compte scrutateur pour obtenir les droits de téléversement des documents de votre bureau de vote.',
          'You declared the poll watcher area. Activate your poll watcher account to get upload rights for your polling station documents.',
        )}
      </p>

      {!ouvert ? (
        <button type="button" onClick={() => setOuvert(true)} className="rounded-md bg-kgreen px-5 py-[11px] font-sans text-[14px] font-bold text-white">
          {t('Créer mon compte scrutateur', 'Create my poll watcher account')}
        </button>
      ) : (
        <form onSubmit={activer}>
          {err && <div className="mb-2 font-sans text-[13px] text-kred">{err}</div>}
          <select value={f.region} onChange={set('region')} className={`${champ} mb-2`}>
            <option value="">{t('Région…', 'Region…')}</option>
            {REGIONS.map((r) => <option key={r.fr} value={t(r)}>{t(r)}</option>)}
          </select>
          <div className="mb-2 grid grid-cols-2 gap-2">
            <input value={f.departement} onChange={set('departement')} placeholder={t('Département', 'Department')} className={champ} />
            <input value={f.arrondissement} onChange={set('arrondissement')} placeholder={t('Arrondissement', 'District')} className={champ} />
          </div>
          <input value={f.bureau_vote} onChange={set('bureau_vote')} placeholder={t("Bureau de vote d'affectation", 'Assigned polling station')} className={`${champ} mb-3`} />
          <button type="submit" disabled={loading} className="w-full rounded-md bg-kgreen px-5 py-[13px] font-sans text-[15px] font-bold text-white disabled:opacity-60">
            {loading ? t('Activation…', 'Activating…') : t("Activer et ouvrir l'espace scrutateur", 'Activate and open the poll watcher area')}
          </button>
        </form>
      )}
    </div>
  )
}
