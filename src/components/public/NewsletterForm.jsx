import { useState } from 'react'
import { inscrireNewsletter } from '../../lib/content'
import Eyebrow from './Eyebrow'
import ButtonSpinner from '../ui/ButtonSpinner'
import { useT } from '../../i18n/LanguageContext'

// Bloc d'inscription à la newsletter (écrit dans la table newsletter).
// `variant` :
//   - 'green' : fond vert (accueil)
//   - 'light' : fond gris clair (page Faire un don)
// Champ « pot de miel » caché : protection anti-robots légère.
export default function NewsletterForm({ variant = 'green' }) {
  const t = useT()
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
      setMessage(err?.message || t("L'inscription a échoué. Réessayez.", 'Subscription failed. Please try again.'))
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
          {t("Bulletin d'information", 'Newsletter')}
        </Eyebrow>
        <h2
          className={`m-0 mb-3 font-heading text-[clamp(30px,5vw,44px)] font-bold uppercase leading-none ${
            vert ? 'text-white' : 'text-knavy'
          }`}
        >
          {t('Suivez Jacques', 'Follow Jacques')}
        </h2>
        <p
          className={`mx-auto mb-7 font-sans text-[17px] leading-[1.6] ${
            vert ? 'text-[#d7ece1]' : 'text-[#3b465c]'
          }`}
        >
          {t(
            "Souscrivez au bulletin pour rester informé(e) de l'actualité du mouvement et des prochains événements.",
            'Subscribe to the newsletter to stay informed about the movement’s news and upcoming events.',
          )}
        </p>

        {etat === 'ok' ? (
          <div
            className={`pop-in mx-auto flex max-w-[460px] items-center justify-center gap-[10px] rounded-md px-5 py-4 font-sans text-[15px] font-semibold ${
              vert ? 'bg-white/15 text-white' : 'bg-kgreen/10 text-kgreen'
            }`}
            role="status"
          >
            <span
              className={`flex h-6 w-6 flex-none items-center justify-center rounded-full text-[14px] leading-none ${
                vert ? 'bg-white text-kgreen' : 'bg-kgreen text-white'
              }`}
            >
              ✓
            </span>
            {t('Merci ! Votre inscription au bulletin est enregistrée.', 'Thank you! Your newsletter subscription is confirmed.')}
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
              placeholder={t('Prénom', 'First name')}
              aria-label={t('Prénom', 'First name')}
              className="min-w-[150px] flex-1 rounded-[3px] border-none px-4 py-[14px] font-sans text-[15px] leading-none text-knavy outline-none"
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('Adresse e-mail', 'Email address')}
              aria-label={t('Adresse e-mail', 'Email address')}
              className="min-w-[180px] flex-[1.4] rounded-[3px] border border-[#d3d9e2] px-4 py-[14px] font-sans text-[15px] leading-none text-knavy outline-none"
            />
            <button
              type="submit"
              disabled={etat === 'loading'}
              className="inline-flex items-center justify-center gap-2 rounded-[3px] border-none bg-kred px-6 py-[14px] font-sans text-[15px] font-bold leading-none text-white transition-all duration-200 hover:brightness-110 disabled:opacity-70"
            >
              {etat === 'loading' ? (
                <>
                  <ButtonSpinner /> {t('Envoi…', 'Sending…')}
                </>
              ) : (
                t("S'inscrire", 'Subscribe')
              )}
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
