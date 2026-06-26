import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageBanner from '../../components/public/PageBanner'
import Eyebrow from '../../components/public/Eyebrow'
import { soumettreAffiliation } from '../../lib/content'

const REGIONS = [
  'Adamaoua', 'Centre', 'Est', 'Extrême-Nord', 'Littoral', 'Nord',
  'Nord-Ouest', 'Ouest', 'Sud', 'Sud-Ouest', 'Diaspora',
]
const ENGAGEMENTS = ['Membre adhérent', 'Bénévole', 'Sympathisant', 'Scrutateur']

const champ =
  'w-full rounded-md border border-[#d7dce3] px-4 py-[13px] font-sans text-[15px] leading-none text-knavy outline-none focus:border-kgreen bg-white'

export default function Adhesion() {
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
      setErreur('Le nom est obligatoire.')
      return
    }
    if (!f.consent) {
      setErreur("Merci de cocher la case d'engagement pour envoyer votre demande.")
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
      setErreur(err?.message || "L'envoi a échoué. Réessayez.")
    }
  }

  return (
    <>
      <PageBanner surtitre="Adhésion" fil="Adhérer au mouvement" />

      <section className="px-[clamp(16px,5vw,44px)] py-[clamp(40px,6vw,64px)]">
        <div className="mx-auto flex max-w-site flex-wrap items-start gap-[clamp(32px,5vw,56px)]">
          {/* intro */}
          <div className="flex-1 basis-[320px]">
            <Eyebrow color="text-kred" dash className="mb-5">Rejoignez-nous</Eyebrow>
            <h1 className="m-0 mb-[22px] font-heading text-[clamp(38px,6vw,60px)] font-bold uppercase leading-[0.96] text-knavy">
              Adhérez au mouvement
            </h1>
            <p className="m-0 mb-7 font-sans text-[18px] leading-[1.7] text-[#3b465c]">
              En adhérant, vous rejoignez une communauté de citoyennes et de citoyens engagés
              pour un Cameroun souverain et prospère. Ensemble, portons les propositions du
              Mouvement Kamerun, soutenu par le MCNC.
            </p>
            <div className="flex flex-col gap-[14px]">
              {[
                ['1', 'bg-kgreen text-white', 'Participez aux décisions et aux actions de terrain.'],
                ['2', 'bg-kred text-white', 'Recevez les informations et invitations en avant-première.'],
                ['3', 'bg-kgold text-knavy', 'Contribuez à mobiliser dans votre région.'],
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
              <div className="font-heading text-[20px] font-bold uppercase tracking-[0.03em] leading-[1.1] text-white">Formulaire d'adhésion</div>
            </div>

            {etat === 'ok' ? (
              <div className="px-[clamp(22px,3vw,32px)] py-[clamp(34px,4vw,48px)] text-center">
                <div className="mx-auto mb-[22px] flex h-[66px] w-[66px] items-center justify-center rounded-full bg-kgreen text-[30px] leading-none text-white">✓</div>
                <h3 className="m-0 mb-3 font-heading text-[30px] font-bold uppercase leading-[1.05] text-knavy">Demande envoyée — merci !</h3>
                <p className="mx-auto mb-[26px] max-w-[380px] font-sans text-[17px] leading-[1.7] text-[#56607a]">
                  Votre demande d'adhésion a bien été reçue. Elle sera validée par nos équipes et
                  vous recevrez une confirmation par e-mail.
                </p>
                <Link to="/" className="inline-block rounded-md bg-kgreen px-[26px] py-[15px] font-sans text-[15px] font-bold leading-none text-white no-underline">Retour à l'accueil</Link>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="p-[clamp(22px,3vw,30px)]" noValidate>
                {/* pot de miel */}
                <input type="text" tabIndex={-1} autoComplete="off" value={piege} onChange={(e) => setPiege(e.target.value)} aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />

                {erreur && <div role="alert" className="mb-4 rounded-md border border-kred/30 bg-kred/10 px-4 py-3 font-sans text-[14px] text-kred">{erreur}</div>}

                <div className="mb-[14px] font-sans text-[12px] font-bold uppercase tracking-[0.08em] leading-none text-[#9aa6bf]">Identité</div>
                <div className="mb-[14px] flex flex-wrap gap-3">
                  <select value={f.civilite} onChange={set('civilite')} className={`${champ} w-[110px] flex-none`}>
                    <option>M.</option>
                    <option>Mme</option>
                  </select>
                  <input type="text" placeholder="Prénom" value={f.prenom} onChange={set('prenom')} className={`${champ} min-w-[130px] flex-1`} />
                </div>
                <input type="text" placeholder="Nom" value={f.nom} onChange={set('nom')} required className={`${champ} mb-[22px]`} />

                <div className="mb-[14px] font-sans text-[12px] font-bold uppercase tracking-[0.08em] leading-none text-[#9aa6bf]">Contact</div>
                <input type="email" placeholder="Adresse e-mail" value={f.email} onChange={set('email')} className={`${champ} mb-[14px]`} />
                <input type="tel" placeholder="Téléphone (+237…)" value={f.telephone} onChange={set('telephone')} className={`${champ} mb-[22px]`} />

                <div className="mb-[14px] font-sans text-[12px] font-bold uppercase tracking-[0.08em] leading-none text-[#9aa6bf]">Zone</div>
                <div className="mb-[14px] flex flex-wrap gap-3">
                  <select value={f.region} onChange={set('region')} className={`${champ} min-w-[150px] flex-1`}>
                    <option value="">Région…</option>
                    {REGIONS.map((r) => <option key={r}>{r}</option>)}
                  </select>
                  <input type="text" placeholder="Ville / localité" value={f.ville} onChange={set('ville')} className={`${champ} min-w-[150px] flex-1`} />
                </div>
                <select value={f.engagement} onChange={set('engagement')} className={`${champ} mb-[22px]`}>
                  <option value="">Type d'engagement…</option>
                  {ENGAGEMENTS.map((e) => <option key={e}>{e}</option>)}
                </select>

                <label className="mb-[22px] flex cursor-pointer items-start gap-[10px]">
                  <input type="checkbox" checked={f.consent} onChange={set('consent')} className="mt-[2px] h-[18px] w-[18px] flex-none accent-kgreen" />
                  <span className="font-sans text-[14px] leading-[1.5] text-[#56607a]">
                    J'adhère aux valeurs et au programme du Mouvement Kamerun et j'accepte d'être
                    recontacté(e).
                  </span>
                </label>

                <button type="submit" disabled={etat === 'loading'} className="w-full rounded-md bg-kgreen px-4 py-[18px] font-sans text-[17px] font-bold leading-none text-white disabled:opacity-60">
                  {etat === 'loading' ? 'Envoi…' : "Envoyer ma demande d'adhésion"}
                </button>
                <div className="mt-4 flex items-start gap-2 font-sans text-[13px] leading-[1.5] text-[#7c879c]">
                  <span className="flex-none font-bold text-kgreen">ⓘ</span>
                  Votre demande sera examinée et validée par nos équipes. Vous recevrez une
                  confirmation par e-mail.
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
