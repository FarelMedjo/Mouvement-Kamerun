import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageBanner from '../../components/public/PageBanner'
import Eyebrow from '../../components/public/Eyebrow'
import Alert from '../../components/auth/Alert'
import { useAuth } from '../../auth/AuthContext'

const REGIONS = [
  'Adamaoua', 'Centre', 'Est', 'Extrême-Nord', 'Littoral', 'Nord',
  'Nord-Ouest', 'Ouest', 'Sud', 'Sud-Ouest', 'Diaspora',
]

const MISSIONS = [
  { n: '01', t: 'Surveiller', d: "Assister à l'ouverture, au vote et à la clôture du bureau.", c: 'bg-knavy text-white' },
  { n: '02', t: 'Vérifier', d: 'Contrôler le décompte des voix et la conformité du procès-verbal.', c: 'bg-kgreen text-kgold' },
  { n: '03', t: 'Signaler', d: 'Documenter et remonter toute irrégularité constatée.', c: 'bg-kred text-white' },
  { n: '04', t: 'Attester', d: 'Transmettre les résultats certifiés à la coordination du mouvement.', c: 'bg-kgold text-knavy' },
]

const champ =
  'w-full rounded-md border border-[#d7dce3] px-4 py-[13px] font-sans text-[15px] leading-none text-knavy outline-none focus:border-kgreen bg-white'

export default function EspaceScrutateurs() {
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

  const onSubmit = async (e) => {
    e.preventDefault()
    setErreur('')
    setSucces('')
    if (!f.nom.trim() || !f.prenom.trim()) return setErreur('Nom et prénom sont obligatoires.')
    if (f.password.length < 8) return setErreur('Le mot de passe doit contenir au moins 8 caractères.')
    if (f.password !== f.confirmation) return setErreur('Les deux mots de passe ne correspondent pas.')
    if (!f.consent) return setErreur("Merci d'accepter la charte du scrutateur pour continuer.")

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
        'Compte scrutateur créé. Un e-mail de confirmation vous a été envoyé : cliquez sur le lien, puis connectez-vous pour accéder à votre tableau de bord.'
      )
      setLoading(false)
    } catch (err) {
      setErreur(traduireErreur(err))
      setLoading(false)
    }
  }

  return (
    <>
      <PageBanner surtitre="Espace Scrutateurs" fil="Inscription scrutateur" />

      <section className="px-[clamp(16px,5vw,44px)] py-[clamp(40px,6vw,64px)]">
        <div className="mx-auto flex max-w-site flex-wrap items-start gap-[clamp(32px,5vw,56px)]">
          {/* présentation du rôle */}
          <div className="flex-1 basis-[340px]">
            <Eyebrow color="text-kred" dash className="mb-5">Garants de la transparence</Eyebrow>
            <h1 className="m-0 mb-5 font-heading text-[clamp(34px,5.5vw,56px)] font-bold uppercase leading-[0.96] text-knavy">
              Le rôle du scrutateur
            </h1>
            <p className="m-0 mb-7 font-sans text-[18px] leading-[1.7] text-[#3b465c]">
              Le scrutateur représente le mouvement dans un bureau de vote. Il veille au bon
              déroulement du scrutin, du dépouillement et de la transmission des résultats. Son
              engagement est essentiel pour garantir un vote transparent et protéger le choix
              des citoyens.
            </p>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
              {MISSIONS.map((m) => (
                <div key={m.n} className="rounded-md border border-[#e3e7ec] bg-white p-5">
                  <div className={`mb-3 flex h-[38px] w-[38px] items-center justify-center rounded-full font-heading text-[17px] font-bold ${m.c}`}>
                    {m.n}
                  </div>
                  <h3 className="m-0 mb-2 font-heading text-[20px] font-semibold uppercase leading-none text-knavy">{m.t}</h3>
                  <p className="m-0 font-sans text-[15px] leading-[1.55] text-[#56607a]">{m.d}</p>
                </div>
              ))}
            </div>
          </div>

          {/* formulaire d'inscription */}
          <div className="w-full max-w-[520px] flex-1 basis-[380px] overflow-hidden rounded-lg border border-[#e3e7ec] bg-white shadow-[0_6px_28px_rgba(17,32,63,.08)]">
            <div className="flex items-center justify-between bg-kgreen px-7 py-5">
              <div className="font-heading text-[20px] font-bold uppercase tracking-[0.03em] leading-[1.1] text-white">Créer mon compte scrutateur</div>
              <span className="font-sans text-[12px] font-semibold text-white/90">🔒 Espace sécurisé</span>
            </div>

            <div className="p-[clamp(22px,3vw,30px)]">
              <Alert>{erreur}</Alert>
              <Alert type="success">{succes}</Alert>

              {!succes && (
                <form onSubmit={onSubmit} noValidate>
                  <div className="mb-[14px] font-sans text-[12px] font-bold uppercase tracking-[0.08em] leading-none text-[#9aa6bf]">Identité &amp; contact</div>
                  <div className="mb-[14px] grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Prénom" value={f.prenom} onChange={set('prenom')} className={champ} />
                    <input type="text" placeholder="Nom" value={f.nom} onChange={set('nom')} className={champ} />
                  </div>
                  <input type="tel" placeholder="Téléphone (+237…)" value={f.telephone} onChange={set('telephone')} className={`${champ} mb-[14px]`} />
                  <input type="email" placeholder="Adresse e-mail" value={f.email} onChange={set('email')} className={`${champ} mb-[22px]`} />

                  <div className="mb-[14px] font-sans text-[12px] font-bold uppercase tracking-[0.08em] leading-none text-[#9aa6bf]">Localisation</div>
                  <select value={f.region} onChange={set('region')} className={`${champ} mb-[14px]`}>
                    <option value="">Région…</option>
                    {REGIONS.map((r) => <option key={r}>{r}</option>)}
                  </select>
                  <div className="mb-[14px] grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Département" value={f.departement} onChange={set('departement')} className={champ} />
                    <input type="text" placeholder="Arrondissement" value={f.arrondissement} onChange={set('arrondissement')} className={champ} />
                  </div>
                  <input type="text" placeholder="Bureau de vote d'affectation" value={f.bureau_vote} onChange={set('bureau_vote')} className={`${champ} mb-[22px]`} />

                  <div className="mb-[14px] font-sans text-[12px] font-bold uppercase tracking-[0.08em] leading-none text-[#9aa6bf]">Identifiants de connexion</div>
                  <div className="mb-[22px] grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <input type="password" placeholder="Mot de passe" value={f.password} onChange={set('password')} autoComplete="new-password" className={champ} />
                    <input type="password" placeholder="Confirmer le mot de passe" value={f.confirmation} onChange={set('confirmation')} autoComplete="new-password" className={champ} />
                  </div>

                  <label className="mb-[22px] flex cursor-pointer items-start gap-[10px]">
                    <input type="checkbox" checked={f.consent} onChange={set('consent')} className="mt-[2px] h-[18px] w-[18px] flex-none accent-kgreen" />
                    <span className="font-sans text-[14px] leading-[1.5] text-[#56607a]">
                      Je m'engage à exercer ma mission de scrutateur avec intégrité et j'accepte
                      la charte du mouvement.
                    </span>
                  </label>

                  <button type="submit" disabled={loading} className="w-full rounded-md bg-kgreen px-4 py-[18px] font-sans text-[17px] font-bold leading-none text-white disabled:opacity-60">
                    {loading ? 'Création…' : 'Créer mon compte'}
                  </button>
                  <div className="mt-4 flex items-start gap-2 font-sans text-[13px] leading-[1.5] text-[#7c879c]">
                    <span className="flex-none font-bold text-kgreen">ⓘ</span>
                    Vos fichiers de scrutateur ne seront accessibles qu'aux administrateurs.
                  </div>
                </form>
              )}

              <p className="mt-5 text-center font-sans text-[14px] text-[#56607a]">
                Déjà inscrit ?{' '}
                <Link to="/connexion" className="font-bold text-kgreen no-underline">Se connecter</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function traduireErreur(err) {
  const msg = (err?.message || '').toLowerCase()
  if (msg.includes('already registered') || msg.includes('already been registered'))
    return 'Un compte existe déjà avec cette adresse e-mail.'
  if (msg.includes('password')) return 'Mot de passe trop faible (au moins 8 caractères).'
  if (msg.includes('invalid') && msg.includes('email')) return "L'adresse e-mail n'est pas valide."
  return err?.message || 'Une erreur est survenue. Réessayez.'
}
