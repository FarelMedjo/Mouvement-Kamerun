import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { getMesDetails, enregistrerMesDetails } from '../../lib/membre'
import { useLang } from '../../i18n/LanguageContext'

const champ =
  'w-full rounded-md border border-[#d7dce3] px-4 py-[13px] font-sans text-[15px] leading-none text-knavy outline-none focus:border-kgreen bg-white'

export default function MembreDashboard() {
  const t = useLang().t
  const { user } = useAuth()
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

  // Nom et téléphone sont mémorisés dans les métadonnées à l'inscription
  // (data.nom_complet / data.telephone) ; la zone vient de membre_details.
  const nom = user?.user_metadata?.nom_complet || '—'
  const telephone = user?.user_metadata?.telephone || '—'

  return (
    <>
      {/* bandeau d'accueil */}
      <div className="bg-kgreen px-[clamp(16px,5vw,40px)] py-[clamp(22px,3vw,30px)]">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="m-0 font-heading text-[clamp(26px,4vw,38px)] font-bold uppercase leading-none text-white">
              {t('Espace membre', 'Member area')}
            </h1>
            <p className="m-0 mt-[6px] font-sans text-[14px] leading-[1.5] text-[#d7ece1]">
              {t('Bienvenue au sein du Mouvement Kamerun.', 'Welcome to Mouvement Kamerun.')}
            </p>
          </div>
          <div className="rounded-md bg-white/10 px-[18px] py-3">
            <div className="font-heading text-[22px] font-bold leading-none text-kgold">{t('Membre', 'Member')}</div>
            <div className="mt-1 font-sans text-[11px] font-semibold uppercase tracking-[0.06em] leading-none text-[#e6f1ea]">{t('statut', 'status')}</div>
          </div>
        </div>
      </div>

      <section className="px-[clamp(16px,5vw,40px)] py-[clamp(28px,4vw,44px)]">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-start gap-[clamp(22px,3vw,32px)]">

          {/* colonne profil membre */}
          <div className="flex-1 basis-[360px]">
            <div className="mb-[14px] flex items-center justify-between">
              <div className="font-sans text-[13px] font-bold uppercase tracking-[0.08em] leading-none text-knavy">
                {t('Mon adhésion', 'My membership')}
              </div>
              {!chargement && !edition && (
                <button type="button" onClick={() => setEdition(true)} className="font-sans text-[13px] font-bold text-kgreen">
                  {t('Modifier', 'Edit')}
                </button>
              )}
            </div>

            {chargement ? (
              <div className="rounded-lg border border-[#e3e7ec] bg-white px-5 py-7 text-center font-sans text-[14px] text-[#9aa6bf]">
                {t('Chargement…', 'Loading…')}
              </div>
            ) : edition ? (
              <FormulaireZone
                initial={details}
                onSaved={async () => { await rafraichir(); setEdition(false) }}
                onCancel={() => setEdition(false)}
              />
            ) : (
              <div className="overflow-hidden rounded-lg border border-[#e3e7ec] bg-white">
                <Ligne libelle={t('Nom', 'Name')} valeur={nom} />
                <Ligne libelle={t('E-mail', 'Email')} valeur={user?.email || '—'} />
                <Ligne libelle={t('Téléphone', 'Phone')} valeur={telephone} />
                <Ligne libelle={t('Zone géographique', 'Geographic area')} valeur={details?.zone || '—'} />
              </div>
            )}
          </div>

          {/* colonne message d'accueil */}
          <div className="flex-1 basis-[340px]">
            <div className="rounded-lg border border-[#cfe6da] bg-[#eaf3ee] px-5 py-[18px]">
              <div className="mb-1 font-sans text-[14px] font-bold text-[#1f5b41]">{t('Merci de votre adhésion', 'Thank you for joining')}</div>
              <p className="m-0 font-sans text-[14px] leading-[1.6] text-[#1f5b41]">
                {t(
                  'Vous recevrez les informations et invitations du mouvement en avant-première. Pensez à tenir votre zone à jour pour être orienté(e) vers les actions près de chez vous.',
                  'You will receive the movement’s information and invitations first. Remember to keep your area up to date so we can guide you towards actions near you.',
                )}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function Ligne({ libelle, valeur }) {
  return (
    <div className="border-b border-[#f1f3f6] px-[18px] py-[14px] last:border-b-0">
      <div className="mb-1 font-sans text-[11px] font-bold uppercase tracking-[0.06em] leading-none text-[#9aa6bf]">{libelle}</div>
      <div className="font-sans text-[15px] leading-[1.4] text-knavy">{valeur}</div>
    </div>
  )
}

// Formulaire de mise à jour de la zone géographique du membre.
function FormulaireZone({ initial, onSaved, onCancel }) {
  const t = useLang().t
  const [zone, setZone] = useState(initial?.zone || '')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    try {
      await enregistrerMesDetails({ zone })
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
      <input value={zone} onChange={(e) => setZone(e.target.value)} placeholder={t('Ex. Yaoundé, Centre', 'E.g. Yaoundé, Centre')} className={`${champ} mb-4`} />

      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="rounded-md bg-kgreen px-5 py-[11px] font-sans text-[14px] font-bold text-white disabled:opacity-60">
          {loading ? t('Enregistrement…', 'Saving…') : t('Enregistrer', 'Save')}
        </button>
        <button type="button" onClick={onCancel} className="rounded-md border border-[#d7dce3] px-5 py-[11px] font-sans text-[14px] font-bold text-[#56607a]">
          {t('Annuler', 'Cancel')}
        </button>
      </div>
    </form>
  )
}
