import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageBanner from '../../components/public/PageBanner'
import Eyebrow from '../../components/public/Eyebrow'
import Alert from '../../components/auth/Alert'
import { useAuth } from '../../auth/AuthContext'
import { REGIONS } from '../../config/site'
import { DEPARTEMENTS } from '../../config/cameroun'
import { useT } from '../../i18n/LanguageContext'

// `t` (titre) / `d` (description) bilingues ({ fr, en }).
const MISSIONS = [
  { n: '01', t: { fr: 'Surveiller', en: 'Observe' }, d: { fr: "Assister à l'ouverture, au vote et à la clôture du bureau.", en: 'Attend the opening, voting and closing of the polling station.' }, c: 'bg-knavy text-white' },
  { n: '02', t: { fr: 'Vérifier', en: 'Verify' }, d: { fr: 'Contrôler le décompte des voix et la conformité du procès-verbal.', en: 'Check the vote count and the accuracy of the official report.' }, c: 'bg-kgreen text-kgold' },
  { n: '03', t: { fr: 'Signaler', en: 'Report' }, d: { fr: 'Documenter et remonter toute irrégularité constatée.', en: 'Document and report any irregularity observed.' }, c: 'bg-kred text-white' },
  { n: '04', t: { fr: 'Attester', en: 'Certify' }, d: { fr: 'Transmettre les résultats certifiés à la coordination du mouvement.', en: 'Send the certified results to the movement’s coordination.' }, c: 'bg-kgold text-knavy' },
]

const champ =
  'w-full rounded-md border border-[#d7dce3] px-4 py-[13px] font-sans text-[15px] leading-none text-knavy outline-none focus:border-kgreen bg-white'

export default function EspaceScrutateurs() {
  const t = useT()
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [f, setF] = useState({
    prenom: '', nom: '', telephone: '', email: '',
    region: '', departement: '', arrondissement: '', bureau_vote: '',
    password: '', confirmation: '', consent: false,
  })
  const [erreur, setErreur] = useState('')
  const [succes, setSucces] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) =>
    setF((p) => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  // Sélecteurs en cascade : changer la région réinitialise département + arrondissement ;
  // changer le département réinitialise l'arrondissement.
  const setRegion = (e) => setF((p) => ({ ...p, region: e.target.value, departement: '', arrondissement: '' }))
  const setDepartement = (e) => setF((p) => ({ ...p, departement: e.target.value, arrondissement: '' }))

  const departements = Object.keys(DEPARTEMENTS[f.region] || {}) // [] si Diaspora / région sans découpage
  const arrondissements = DEPARTEMENTS[f.region]?.[f.departement] || []

  const onSubmit = async (e) => {
    e.preventDefault()
    setErreur('')
    setSucces('')
    if (!f.nom.trim() || !f.prenom.trim()) return setErreur(t('Nom et prénom sont obligatoires.', 'First and last name are required.'))
    if (f.password.length < 8) return setErreur(t('Le mot de passe doit contenir au moins 8 caractères.', 'The password must contain at least 8 characters.'))
    if (f.password !== f.confirmation) return setErreur(t('Les deux mots de passe ne correspondent pas.', 'The two passwords do not match.'))
    if (!f.consent) return setErreur(t("Merci d'accepter la charte du scrutateur pour continuer.", 'Please accept the poll watcher charter to continue.'))

    setLoading(true)
    try {
      const data = await signUp({
        email: f.email.trim(),
        password: f.password,
        role: 'scrutateur',
        nomComplet: `${f.prenom.trim()} ${f.nom.trim()}`,
        telephone: f.telephone.trim(),
        metaExtra: {
          sc_region: f.region || null,
          sc_departement: f.departement.trim() || null,
          sc_arrondissement: f.arrondissement.trim() || null,
          sc_bureau_vote: f.bureau_vote.trim() || null,
        },
      })
      if (data.session) {
        navigate('/scrutateurs/tableau-de-bord', { replace: true })
        return
      }
      setSucces(
        t(
          'Compte scrutateur créé. Un e-mail de confirmation vous a été envoyé : cliquez sur le lien, puis connectez-vous pour accéder à votre tableau de bord.',
          'Poll watcher account created. A confirmation email has been sent to you: click the link, then sign in to access your dashboard.',
        )
      )
      setLoading(false)
    } catch (err) {
      setErreur(traduireErreur(err, t))
      setLoading(false)
    }
  }

  return (
    <>
      <PageBanner surtitre={t('Espace Scrutateurs', 'Poll Watchers')} fil={t('Inscription scrutateur', 'Poll watcher registration')} />

      <section className="px-[clamp(16px,5vw,44px)] py-[clamp(40px,6vw,64px)]">
        <div className="mx-auto flex max-w-site flex-wrap items-start gap-[clamp(32px,5vw,56px)]">
          {/* présentation du rôle */}
          <div className="flex-1 basis-[340px]">
            <Eyebrow color="text-kred" dash className="mb-5">{t('Garants de la transparence', 'Guardians of transparency')}</Eyebrow>
            <h1 className="m-0 mb-5 font-heading text-[clamp(34px,5.5vw,56px)] font-bold uppercase leading-[0.96] text-knavy">
              {t('Le rôle du scrutateur', 'The role of the poll watcher')}
            </h1>
            <p className="m-0 mb-4 font-sans text-[18px] leading-[1.7] text-[#3b465c]">
              {t(
                "Le scrutateur travaille avec le mouvement de manière bénévole dans un bureau de vote ; il n'a pas nécessairement à être membre du parti ou du mouvement. Il veille au bon déroulement du scrutin, du dépouillement et de la transmission des résultats. Son engagement est essentiel pour garantir un vote transparent et protéger le choix des citoyens.",
                'The poll watcher works with the movement on a voluntary basis at a polling station; they do not necessarily have to be a member of the party or the movement. They ensure the proper conduct of the vote, the count and the transmission of results. Their commitment is essential to guarantee a transparent vote and protect citizens’ choice.',
              )}
            </p>
            <p className="m-0 mb-7 font-sans text-[15px] font-semibold leading-[1.6] text-kred">
              {t(
                "Le rôle de scrutateur est entièrement bénévole : aucune adhésion au mouvement n'est requise pour s'engager.",
                'The poll watcher role is entirely voluntary: no membership of the movement is required to get involved.',
              )}
            </p>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
              {MISSIONS.map((m) => (
                <div key={m.n} className="rounded-md border border-[#e3e7ec] bg-white p-5">
                  <div className={`mb-3 flex h-[38px] w-[38px] items-center justify-center rounded-full font-heading text-[17px] font-bold ${m.c}`}>
                    {m.n}
                  </div>
                  <h3 className="m-0 mb-2 font-heading text-[20px] font-semibold uppercase leading-none text-knavy">{t(m.t)}</h3>
                  <p className="m-0 font-sans text-[15px] leading-[1.55] text-[#56607a]">{t(m.d)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* formulaire d'inscription */}
          <div className="w-full max-w-[520px] flex-1 basis-[380px] overflow-hidden rounded-lg border border-[#e3e7ec] bg-white shadow-[0_6px_28px_rgba(17,32,63,.08)]">
            <div className="flex items-center justify-between bg-kgreen px-7 py-5">
              <div className="font-heading text-[20px] font-bold uppercase tracking-[0.03em] leading-[1.1] text-white">{t('Créer mon compte scrutateur', 'Create my poll watcher account')}</div>
              <span className="font-sans text-[12px] font-semibold text-white/90">{t('🔒 Espace sécurisé', '🔒 Secure area')}</span>
            </div>

            <div className="p-[clamp(22px,3vw,30px)]">
              <Alert>{erreur}</Alert>
              <Alert type="success">{succes}</Alert>

              {!succes && (
                <>
                <div className="mb-5 rounded-md border border-kred/25 bg-kred/[0.06] px-4 py-3 font-sans text-[13px] font-semibold leading-[1.5] text-kred">
                  {t(
                    "Engagement 100 % bénévole — aucune adhésion au mouvement n'est requise pour devenir scrutateur.",
                    'A 100% voluntary commitment — no membership of the movement is required to become a poll watcher.',
                  )}
                </div>
                <form onSubmit={onSubmit} noValidate>
                  <div className="mb-[14px] font-sans text-[12px] font-bold uppercase tracking-[0.08em] leading-none text-[#9aa6bf]">{t('Identité & contact', 'Identity & contact')}</div>
                  <div className="mb-[14px] grid grid-cols-2 gap-3">
                    <input type="text" placeholder={t('Prénom', 'First name')} value={f.prenom} onChange={set('prenom')} className={champ} />
                    <input type="text" placeholder={t('Nom', 'Last name')} value={f.nom} onChange={set('nom')} className={champ} />
                  </div>
                  <input type="tel" placeholder={t('Téléphone (+237…)', 'Phone (+237…)')} value={f.telephone} onChange={set('telephone')} className={`${champ} mb-[14px]`} />
                  <input type="email" placeholder={t('Adresse e-mail', 'Email address')} value={f.email} onChange={set('email')} className={`${champ} mb-[22px]`} />

                  <div className="mb-[14px] font-sans text-[12px] font-bold uppercase tracking-[0.08em] leading-none text-[#9aa6bf]">{t('Localisation', 'Location')}</div>
                  <select value={f.region} onChange={setRegion} className={`${champ} mb-[14px]`}>
                    <option value="">{t('Région…', 'Region…')}</option>
                    {REGIONS.map((r) => <option key={r.fr} value={r.fr}>{t(r)}</option>)}
                  </select>
                  <div className="mb-[14px] grid grid-cols-2 gap-3">
                    {departements.length > 0 ? (
                      <select value={f.departement} onChange={setDepartement} className={champ}>
                        <option value="">{t('Département…', 'Department…')}</option>
                        {departements.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                    ) : (
                      <input type="text" placeholder={t('Département', 'Department')} value={f.departement} onChange={set('departement')} className={champ} />
                    )}
                    {departements.length > 0 ? (
                      <select value={f.arrondissement} onChange={set('arrondissement')} disabled={!f.departement} className={`${champ} disabled:opacity-60`}>
                        <option value="">{t('Arrondissement…', 'District…')}</option>
                        {arrondissements.map((a) => <option key={a} value={a}>{a}</option>)}
                      </select>
                    ) : (
                      <input type="text" placeholder={t('Arrondissement', 'District')} value={f.arrondissement} onChange={set('arrondissement')} className={champ} />
                    )}
                  </div>
                  <input type="text" placeholder={t("Bureau de vote d'affectation", 'Assigned polling station')} value={f.bureau_vote} onChange={set('bureau_vote')} className={`${champ} mb-[22px]`} />

                  <div className="mb-[14px] font-sans text-[12px] font-bold uppercase tracking-[0.08em] leading-none text-[#9aa6bf]">{t('Identifiants de connexion', 'Login credentials')}</div>
                  <div className="mb-[22px] grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <input type="password" placeholder={t('Mot de passe', 'Password')} value={f.password} onChange={set('password')} autoComplete="new-password" className={champ} />
                    <input type="password" placeholder={t('Confirmer le mot de passe', 'Confirm password')} value={f.confirmation} onChange={set('confirmation')} autoComplete="new-password" className={champ} />
                  </div>

                  <label className="mb-[22px] flex cursor-pointer items-start gap-[10px]">
                    <input type="checkbox" checked={f.consent} onChange={set('consent')} className="mt-[2px] h-[18px] w-[18px] flex-none accent-kgreen" />
                    <span className="font-sans text-[14px] leading-[1.5] text-[#56607a]">
                      {t(
                        "Je m'engage à exercer la charge de scrutateur de manière bénévole, sans contrepartie financière ou matérielle, avec intégrité.",
                        'I commit to carrying out the role of poll watcher on a voluntary basis, without any financial or material compensation, with integrity.',
                      )}
                    </span>
                  </label>

                  <button type="submit" disabled={loading} className="w-full rounded-md bg-kgreen px-4 py-[18px] font-sans text-[17px] font-bold leading-none text-white disabled:opacity-60">
                    {loading ? t('Création…', 'Creating…') : t('Créer mon compte', 'Create my account')}
                  </button>
                  <div className="mt-4 flex items-start gap-2 font-sans text-[13px] leading-[1.5] text-[#7c879c]">
                    <span className="flex-none font-bold text-kgreen">ⓘ</span>
                    {t("Vos fichiers de scrutateur ne seront accessibles qu'aux administrateurs.", 'Your poll watcher files will only be accessible to administrators.')}
                  </div>
                </form>
                </>
              )}

              <p className="mt-5 text-center font-sans text-[14px] text-[#56607a]">
                {t('Déjà inscrit ?', 'Already registered?')}{' '}
                <Link to="/connexion" className="font-bold text-kgreen no-underline">{t('Se connecter', 'Sign in')}</Link>
              </p>
            </div>
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
