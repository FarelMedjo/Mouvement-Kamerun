import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageBanner from '../../components/public/PageBanner'
import Eyebrow from '../../components/public/Eyebrow'
import ButtonSpinner from '../../components/ui/ButtonSpinner'
import { useAuth } from '../../auth/AuthContext'
import { REGIONS } from '../../config/site'
import { VILLES } from '../../config/cameroun'
import { useT } from '../../i18n/LanguageContext'

const champ =
  'w-full rounded-md border border-[#d7dce3] px-4 py-[13px] font-sans text-[15px] leading-none text-knavy outline-none focus:border-kgreen bg-white'

// Construit la chaîne « zone » à partir de la ville et de la région
// (stockée dans membre_details.zone).
function composerZone(ville, region) {
  return [ (ville || '').trim(), region ].filter(Boolean).join(', ')
}

export default function Adhesion() {
  const t = useT()
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [f, setF] = useState({
    civilite: 'M.', prenom: '', nom: '', email: '', telephone: '',
    region: '', ville: '', password: '', confirmation: '', consent: false,
  })
  const [piege, setPiege] = useState('')
  const [etat, setEtat] = useState('idle') // idle | loading | ok | error
  const [erreur, setErreur] = useState('')

  const set = (k) => (e) =>
    setF((prev) => ({ ...prev, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  // Menu déroulant en cascade : changer la région réinitialise la ville.
  const setRegion = (e) => setF((prev) => ({ ...prev, region: e.target.value, ville: '' }))
  const villes = VILLES[f.region] || [] // [] si Diaspora / région sans liste → saisie libre

  const onSubmit = async (e) => {
    e.preventDefault()
    setErreur('')
    if (!f.nom.trim() || !f.prenom.trim()) {
      setErreur(t('Nom et prénom sont obligatoires.', 'First and last name are required.'))
      return
    }
    if (!f.email.trim()) {
      setErreur(t('Une adresse e-mail est nécessaire pour créer votre compte.', 'An email address is required to create your account.'))
      return
    }
    if (f.password.length < 8) {
      setErreur(t('Le mot de passe doit contenir au moins 8 caractères.', 'The password must contain at least 8 characters.'))
      return
    }
    if (f.password !== f.confirmation) {
      setErreur(t('Les deux mots de passe ne correspondent pas.', 'The two passwords do not match.'))
      return
    }
    if (!f.consent) {
      setErreur(t("Merci de cocher la case d'engagement pour créer votre compte.", 'Please tick the commitment box to create your account.'))
      return
    }
    if (piege) {
      setEtat('ok') // robot probable
      return
    }
    setEtat('loading')
    try {
      const data = await signUp({
        email: f.email.trim(),
        password: f.password,
        role: 'membre',
        nomComplet: `${f.prenom.trim()} ${f.nom.trim()}`,
        telephone: f.telephone.trim(),
        metaExtra: { mb_zone: composerZone(f.ville, f.region) || null },
      })
      // Session immédiate (confirmation d'e-mail désactivée) : on entre dans
      // l'espace membre.
      if (data.session) {
        navigate('/membres/tableau-de-bord', { replace: true })
        return
      }
      // Sinon : confirmation d'e-mail requise.
      setEtat('ok')
    } catch (err) {
      setEtat('error')
      setErreur(traduireErreur(err, t))
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
                'En adhérant, vous créez votre compte membre et rejoignez une communauté de citoyennes et de citoyens engagés pour un Cameroun souverain et prospère. Ensemble, portons les propositions du Mouvement Kamerun, soutenu par le MCNC.',
                'By joining, you create your member account and become part of a community of citizens committed to a sovereign and prosperous Cameroon. Together, let us carry the proposals of Mouvement Kamerun, supported by the MCNC.',
              )}
            </p>
            <div className="flex flex-col gap-[14px]">
              {[
                ['1', 'bg-kgreen text-white', t('Accédez à votre espace membre personnel.', 'Access your personal member area.')],
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
            <div className="flex items-center justify-between bg-kgreen px-7 py-5">
              <div className="font-heading text-[20px] font-bold uppercase tracking-[0.03em] leading-[1.1] text-white">{t('Créer mon compte membre', 'Create my member account')}</div>
              <span className="font-sans text-[12px] font-semibold text-white/90">{t('🔒 Espace sécurisé', '🔒 Secure area')}</span>
            </div>

            {etat === 'ok' ? (
              <div className="px-[clamp(22px,3vw,32px)] py-[clamp(34px,4vw,48px)] text-center">
                <div className="pop-in mx-auto mb-[22px] flex h-[66px] w-[66px] items-center justify-center rounded-full bg-kgreen text-[30px] leading-none text-white">✓</div>
                <h3 className="m-0 mb-3 font-heading text-[30px] font-bold uppercase leading-[1.05] text-knavy">{t('Compte créé — merci !', 'Account created — thank you!')}</h3>
                <p className="mx-auto mb-[26px] max-w-[380px] font-sans text-[17px] leading-[1.7] text-[#56607a]">
                  {t(
                    'Votre compte membre a bien été créé. Un e-mail de confirmation vous a été envoyé : cliquez sur le lien, puis connectez-vous pour accéder à votre espace.',
                    'Your member account has been created. A confirmation email has been sent to you: click the link, then sign in to access your area.',
                  )}
                </p>
                <Link to="/connexion" className="inline-block rounded-md bg-kgreen px-[26px] py-[15px] font-sans text-[15px] font-bold leading-none text-white no-underline">{t('Se connecter', 'Sign in')}</Link>
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
                <input type="email" placeholder={t('Adresse e-mail', 'Email address')} value={f.email} onChange={set('email')} required className={`${champ} mb-[14px]`} />
                <input type="tel" placeholder={t('Téléphone (+237…)', 'Phone (+237…)')} value={f.telephone} onChange={set('telephone')} className={`${champ} mb-[22px]`} />

                <div className="mb-[14px] font-sans text-[12px] font-bold uppercase tracking-[0.08em] leading-none text-[#9aa6bf]">{t('Zone', 'Area')}</div>
                <div className="mb-[22px] flex flex-wrap gap-3">
                  <select value={f.region} onChange={setRegion} className={`${champ} min-w-[150px] flex-1`}>
                    <option value="">{t('Région…', 'Region…')}</option>
                    {REGIONS.map((r) => <option key={r.fr} value={r.fr}>{t(r)}</option>)}
                  </select>
                  {villes.length > 0 ? (
                    <select value={f.ville} onChange={set('ville')} className={`${champ} min-w-[150px] flex-1`}>
                      <option value="">{t('Ville / localité…', 'City / locality…')}</option>
                      {villes.map((v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                  ) : (
                    <input type="text" placeholder={t('Ville / localité', 'City / locality')} value={f.ville} onChange={set('ville')} className={`${champ} min-w-[150px] flex-1`} />
                  )}
                </div>

                <div className="mb-[14px] font-sans text-[12px] font-bold uppercase tracking-[0.08em] leading-none text-[#9aa6bf]">{t('Identifiants de connexion', 'Login credentials')}</div>
                <div className="mb-[22px] grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input type="password" placeholder={t('Mot de passe', 'Password')} value={f.password} onChange={set('password')} autoComplete="new-password" className={champ} />
                  <input type="password" placeholder={t('Confirmer le mot de passe', 'Confirm password')} value={f.confirmation} onChange={set('confirmation')} autoComplete="new-password" className={champ} />
                </div>

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
                      <ButtonSpinner /> {t('Création…', 'Creating…')}
                    </>
                  ) : (
                    t('Créer mon compte membre', 'Create my member account')
                  )}
                </button>

                <p className="mt-5 text-center font-sans text-[14px] text-[#56607a]">
                  {t('Déjà membre ?', 'Already a member?')}{' '}
                  <Link to="/connexion" className="font-bold text-kgreen no-underline">{t('Se connecter', 'Sign in')}</Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

function traduireErreur(err, t) {
  const msg = (err?.message || '').toLowerCase()
  if (msg.includes('already registered') || msg.includes('already been registered'))
    return t('Un compte existe déjà avec cette adresse e-mail.', 'An account already exists with this email address.')
  if (msg.includes('password')) return t('Mot de passe trop faible (au moins 8 caractères).', 'Password too weak (at least 8 characters).')
  if (msg.includes('invalid') && msg.includes('email')) return t("L'adresse e-mail n'est pas valide.", 'The email address is not valid.')
  return err?.message || t('Une erreur est survenue. Réessayez.', 'An error occurred. Please try again.')
}
