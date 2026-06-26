import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageBanner from '../../components/public/PageBanner'
import Eyebrow from '../../components/public/Eyebrow'
import ButtonSpinner from '../../components/ui/ButtonSpinner'
import { soumettreAffiliation } from '../../lib/content'
import { REGIONS } from '../../config/site'
import { useT } from '../../i18n/LanguageContext'

const ENGAGEMENTS = [
  { fr: 'Membre adhérent', en: 'Member' },
  { fr: 'Bénévole', en: 'Volunteer' },
  { fr: 'Sympathisant', en: 'Supporter' },
  { fr: 'Scrutateur', en: 'Poll watcher' },
]

const champ =
  'w-full rounded-md border border-[#d7dce3] px-4 py-[13px] font-sans text-[15px] leading-none text-knavy outline-none focus:border-kgreen bg-white'

export default function Adhesion() {
  const t = useT()
  const [f, setF] = useState({
    civilite: 'M.', prenom: '', nom: '', email: '', telephone: '',
    region: '', ville: '', engagement: '', consent: false,
  })
  const [piege, setPiege] = useState('')
  const [etat, setEtat] = useState('idle') // idle | loading | ok | error
  const [erreur, setErreur] = useState('')

  const set = (k) => (e) =>
    setF((prev) => ({ ...prev, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setErreur('')
    if (!f.nom.trim()) {
      setErreur(t('Le nom est obligatoire.', 'Name is required.'))
      return
    }
    if (!f.consent) {
      setErreur(t("Merci de cocher la case d'engagement pour envoyer votre demande.", 'Please tick the commitment box to send your request.'))
      return
    }
    if (piege) {
      setEtat('ok') // robot probable
      return
    }
    setEtat('loading')
    try {
      // zone = « ville, région » (l'engagement et la civilité ne sont pas des
      // colonnes du schéma : on ne les persiste pas pour ne pas le contredire).
      const zone = [f.ville.trim(), f.region].filter(Boolean).join(', ')
      await soumettreAffiliation({
        nom: f.nom.trim(),
        prenom: f.prenom.trim(),
        telephone: f.telephone.trim(),
        email: f.email.trim(),
        zone,
      })
      setEtat('ok')
    } catch (err) {
      setEtat('error')
      setErreur(err?.message || t("L'envoi a échoué. Réessayez.", 'Submission failed. Please try again.'))
    }
  }

  return (
    <>
      <PageBanner surtitre={t('Adhésion', 'Membership')} fil={t('Adhérer au mouvement', 'Join the movement')} />

      <section className="px-[clamp(16px,5vw,44px)] py-[clamp(40px,6vw,64px)]">
        <div className="mx-auto flex max-w-site flex-wrap items-start gap-[clamp(32px,5vw,56px)]">
          {/* intro */}
          <div className="flex-1 basis-[320px]">
            <Eyebrow color="text-kred" dash className="mb-5">{t('Rejoignez-nous', 'Join us')}</Eyebrow>
            <h1 className="m-0 mb-[22px] font-heading text-[clamp(38px,6vw,60px)] font-bold uppercase leading-[0.96] text-knavy">
              {t('Adhérez au mouvement', 'Join the movement')}
            </h1>
            <p className="m-0 mb-7 font-sans text-[18px] leading-[1.7] text-[#3b465c]">
              {t(
                'En adhérant, vous rejoignez une communauté de citoyennes et de citoyens engagés pour un Cameroun souverain et prospère. Ensemble, portons les propositions du Mouvement Kamerun, soutenu par le MCNC.',
                'By joining, you become part of a community of citizens committed to a sovereign and prosperous Cameroon. Together, let us carry the proposals of Mouvement Kamerun, supported by the MCNC.',
              )}
            </p>
            <div className="flex flex-col gap-[14px]">
              {[
                ['1', 'bg-kgreen text-white', t('Participez aux décisions et aux actions de terrain.', 'Take part in decisions and grassroots action.')],
                ['2', 'bg-kred text-white', t('Recevez les informations et invitations en avant-première.', 'Get information and invitations first.')],
                ['3', 'bg-kgold text-knavy', t('Contribuez à mobiliser dans votre région.', 'Help mobilise in your region.')],
              ].map(([n, cls, txt]) => (
                <div key={n} className="flex items-start gap-3">
                  <span className={`flex h-[26px] w-[26px] flex-none items-center justify-center rounded-full font-sans text-[14px] font-bold leading-none ${cls}`}>{n}</span>
                  <span className="font-sans text-[16px] leading-[1.6] text-[#3b465c]">{txt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* carte formulaire */}
          <div className="w-full max-w-[520px] flex-1 basis-[380px] overflow-hidden rounded-lg border border-[#e3e7ec] bg-white shadow-[0_6px_28px_rgba(17,32,63,.08)]">
            <div className="bg-kgreen px-7 py-5">
              <div className="font-heading text-[20px] font-bold uppercase tracking-[0.03em] leading-[1.1] text-white">{t("Formulaire d'adhésion", 'Membership form')}</div>
            </div>

            {etat === 'ok' ? (
              <div className="px-[clamp(22px,3vw,32px)] py-[clamp(34px,4vw,48px)] text-center">
                <div className="pop-in mx-auto mb-[22px] flex h-[66px] w-[66px] items-center justify-center rounded-full bg-kgreen text-[30px] leading-none text-white">✓</div>
                <h3 className="m-0 mb-3 font-heading text-[30px] font-bold uppercase leading-[1.05] text-knavy">{t('Demande envoyée — merci !', 'Request sent — thank you!')}</h3>
                <p className="mx-auto mb-[26px] max-w-[380px] font-sans text-[17px] leading-[1.7] text-[#56607a]">
                  {t(
                    "Votre demande d'adhésion a bien été reçue. Elle sera validée par nos équipes et vous recevrez une confirmation par e-mail.",
                    'Your membership request has been received. It will be reviewed by our teams and you will receive a confirmation by email.',
                  )}
                </p>
                <Link to="/" className="inline-block rounded-md bg-kgreen px-[26px] py-[15px] font-sans text-[15px] font-bold leading-none text-white no-underline">{t("Retour à l'accueil", 'Back to home')}</Link>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="p-[clamp(22px,3vw,30px)]" noValidate>
                {/* pot de miel */}
                <input type="text" tabIndex={-1} autoComplete="off" value={piege} onChange={(e) => setPiege(e.target.value)} aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />

                {erreur && <div role="alert" className="mb-4 rounded-md border border-kred/30 bg-kred/10 px-4 py-3 font-sans text-[14px] text-kred">{erreur}</div>}

                <div className="mb-[14px] font-sans text-[12px] font-bold uppercase tracking-[0.08em] leading-none text-[#9aa6bf]">{t('Identité', 'Identity')}</div>
                <div className="mb-[14px] flex flex-wrap gap-3">
                  <select value={f.civilite} onChange={set('civilite')} className={`${champ} w-[110px] flex-none`}>
                    <option value="M.">{t('M.', 'Mr')}</option>
                    <option value="Mme">{t('Mme', 'Mrs')}</option>
                  </select>
                  <input type="text" placeholder={t('Prénom', 'First name')} value={f.prenom} onChange={set('prenom')} className={`${champ} min-w-[130px] flex-1`} />
                </div>
                <input type="text" placeholder={t('Nom', 'Last name')} value={f.nom} onChange={set('nom')} required className={`${champ} mb-[22px]`} />

                <div className="mb-[14px] font-sans text-[12px] font-bold uppercase tracking-[0.08em] leading-none text-[#9aa6bf]">{t('Contact', 'Contact')}</div>
                <input type="email" placeholder={t('Adresse e-mail', 'Email address')} value={f.email} onChange={set('email')} className={`${champ} mb-[14px]`} />
                <input type="tel" placeholder={t('Téléphone (+237…)', 'Phone (+237…)')} value={f.telephone} onChange={set('telephone')} className={`${champ} mb-[22px]`} />

                <div className="mb-[14px] font-sans text-[12px] font-bold uppercase tracking-[0.08em] leading-none text-[#9aa6bf]">{t('Zone', 'Area')}</div>
                <div className="mb-[14px] flex flex-wrap gap-3">
                  <select value={f.region} onChange={set('region')} className={`${champ} min-w-[150px] flex-1`}>
                    <option value="">{t('Région…', 'Region…')}</option>
                    {REGIONS.map((r) => <option key={r.fr} value={t(r)}>{t(r)}</option>)}
                  </select>
                  <input type="text" placeholder={t('Ville / localité', 'City / locality')} value={f.ville} onChange={set('ville')} className={`${champ} min-w-[150px] flex-1`} />
                </div>
                <select value={f.engagement} onChange={set('engagement')} className={`${champ} mb-[22px]`}>
                  <option value="">{t("Type d'engagement…", 'Type of involvement…')}</option>
                  {ENGAGEMENTS.map((e) => <option key={e.fr} value={t(e)}>{t(e)}</option>)}
                </select>

                <label className="mb-[22px] flex cursor-pointer items-start gap-[10px]">
                  <input type="checkbox" checked={f.consent} onChange={set('consent')} className="mt-[2px] h-[18px] w-[18px] flex-none accent-kgreen" />
                  <span className="font-sans text-[14px] leading-[1.5] text-[#56607a]">
                    {t(
                      "J'adhère aux valeurs et au programme du Mouvement Kamerun et j'accepte d'être recontacté(e).",
                      'I support the values and programme of Mouvement Kamerun and agree to be contacted.',
                    )}
                  </span>
                </label>

                <button type="submit" disabled={etat === 'loading'} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-kgreen px-4 py-[18px] font-sans text-[17px] font-bold leading-none text-white transition-all duration-200 hover:bg-[#095638] disabled:opacity-70">
                  {etat === 'loading' ? (
                    <>
                      <ButtonSpinner /> {t('Envoi en cours…', 'Sending…')}
                    </>
                  ) : (
                    t("Envoyer ma demande d'adhésion", 'Send my membership request')
                  )}
                </button>
                <div className="mt-4 flex items-start gap-2 font-sans text-[13px] leading-[1.5] text-[#7c879c]">
                  <span className="flex-none font-bold text-kgreen">ⓘ</span>
                  {t(
                    'Votre demande sera examinée et validée par nos équipes. Vous recevrez une confirmation par e-mail.',
                    'Your request will be reviewed and validated by our teams. You will receive a confirmation by email.',
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
