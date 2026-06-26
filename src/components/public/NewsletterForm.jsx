import { useState } from 'react'
import { inscrireNewsletter } from '../../lib/content'
import Eyebrow from './Eyebrow'

// Bloc d'inscription à la newsletter (écrit dans la table newsletter).
// `variant` :
//   - 'green' : fond vert (accueil)
//   - 'light' : fond gris clair (page Faire un don)
// Champ « pot de miel » caché : protection anti-robots légère.
export default function NewsletterForm({ variant = 'green' }) {
  const [prenom, setPrenom] = useState('')
  const [email, setEmail] = useState('')
  const [piege, setPiege] = useState('') // honeypot
  const [etat, setEtat] = useState('idle') // idle | loading | ok | error
  const [message, setMessage] = useState('')

  const vert = variant === 'green'

  const onSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    if (piege) {
      // Robot probable : on simule le succès sans rien enregistrer.
      setEtat('ok')
      return
    }
    setEtat('loading')
    try {
      await inscrireNewsletter({ email: email.trim(), nom: prenom.trim() })
      setEtat('ok')
      setPrenom('')
      setEmail('')
    } catch (err) {
      setEtat('error')
      setMessage(err?.message || "L'inscription a échoué. Réessayez.")
    }
  }

  return (
    <section
      className={`px-[clamp(16px,5vw,44px)] py-[clamp(44px,6vw,60px)] ${
        vert ? 'bg-kgreen text-center' : 'bg-klight text-center'
      }`}
    >
      <div className="mx-auto max-w-[600px]">
        <Eyebrow color={vert ? 'text-kgold' : 'text-kgreen'} className="mb-[14px]">
          Bulletin d'information
        </Eyebrow>
        <h2
          className={`m-0 mb-3 font-heading text-[clamp(30px,5vw,44px)] font-bold uppercase leading-none ${
            vert ? 'text-white' : 'text-knavy'
          }`}
        >
          Suivez Jacques
        </h2>
        <p
          className={`mx-auto mb-7 font-sans text-[17px] leading-[1.6] ${
            vert ? 'text-[#d7ece1]' : 'text-[#3b465c]'
          }`}
        >
          Souscrivez au bulletin pour rester informé(e) de l'actualité du mouvement et des
          prochains événements.
        </p>

        {etat === 'ok' ? (
          <div
            className={`mx-auto max-w-[460px] rounded-md px-5 py-4 font-sans text-[15px] font-semibold ${
              vert ? 'bg-white/15 text-white' : 'bg-kgreen/10 text-kgreen'
            }`}
          >
            ✓ Merci ! Votre inscription au bulletin est enregistrée.
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="mx-auto flex max-w-[560px] flex-wrap justify-center gap-[10px]"
            noValidate
          >
            {/* pot de miel (caché aux humains) */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={piege}
              onChange={(e) => setPiege(e.target.value)}
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
              aria-hidden="true"
            />
            <input
              type="text"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              placeholder="Prénom"
              aria-label="Prénom"
              className="min-w-[150px] flex-1 rounded-[3px] border-none px-4 py-[14px] font-sans text-[15px] leading-none text-knavy outline-none"
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Adresse e-mail"
              aria-label="Adresse e-mail"
              className="min-w-[180px] flex-[1.4] rounded-[3px] border border-[#d3d9e2] px-4 py-[14px] font-sans text-[15px] leading-none text-knavy outline-none"
            />
            <button
              type="submit"
              disabled={etat === 'loading'}
              className="rounded-[3px] border-none bg-kred px-6 py-[14px] font-sans text-[15px] font-bold leading-none text-white disabled:opacity-60"
            >
              {etat === 'loading' ? '…' : "S'inscrire"}
            </button>
          </form>
        )}

        {etat === 'error' && (
          <p className={`mt-3 font-sans text-[14px] ${vert ? 'text-kgold' : 'text-kred'}`}>
            {message}
          </p>
        )}
      </div>
    </section>
  )
}
