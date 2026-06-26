import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageBanner from '../../components/public/PageBanner'
import Eyebrow from '../../components/public/Eyebrow'
import { SITE } from '../../config/site'

// Page Contact. Le schéma Supabase ne comporte pas de table « contact » : le
// formulaire ouvre le client e-mail du visiteur (mailto) avec un message
// prérempli. Aucune donnée n'est stockée côté serveur. Une table dédiée ou un
// envoi via Edge Function pourra être ajouté ultérieurement si souhaité.
const SUJETS = ["Demande d'information", 'Presse & médias', 'Bénévolat', 'Don & soutien', 'Autre']

const champ =
  'w-full rounded-md border border-[#d7dce3] px-4 py-[13px] font-sans text-[15px] leading-none text-knavy outline-none focus:border-kgreen bg-white'

export default function Contact() {
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [sujet, setSujet] = useState('')
  const [message, setMessage] = useState('')
  const [envoye, setEnvoye] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    const corps = `Nom : ${nom}\nE-mail : ${email}\nSujet : ${sujet || '—'}\n\n${message}`
    const lien = `mailto:${SITE.emails.mouvement}?subject=${encodeURIComponent(
      `[Contact] ${sujet || 'Message du site'}`
    )}&body=${encodeURIComponent(corps)}`
    window.location.href = lien
    setEnvoye(true)
  }

  return (
    <>
      <PageBanner surtitre="Contact" fil="Nous contacter" />

      <section className="px-[clamp(16px,5vw,44px)] py-[clamp(40px,6vw,64px)]">
        <div className="mx-auto flex max-w-site flex-wrap items-start gap-[clamp(32px,5vw,56px)]">
          {/* coordonnées */}
          <div className="flex-1 basis-[320px]">
            <Eyebrow color="text-kred" dash className="mb-5">Restons en contact</Eyebrow>
            <h1 className="m-0 mb-5 font-heading text-[clamp(38px,6vw,58px)] font-bold uppercase leading-[0.96] text-knavy">
              Nous contacter
            </h1>
            <p className="m-0 mb-7 max-w-[420px] font-sans text-[18px] leading-[1.7] text-[#3b465c]">
              Une question, une proposition, une demande de presse ? Écrivez-nous ou utilisez le
              formulaire, nous vous répondrons dans les meilleurs délais.
            </p>

            <div className="mb-7 flex flex-col gap-4">
              <div className="flex items-start gap-4 rounded-lg bg-klight px-5 py-[18px]">
                <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-kgreen text-[18px] text-white">✉</div>
                <div>
                  <div className="mb-2 font-sans text-[12px] font-bold uppercase tracking-[0.08em] leading-none text-[#9aa6bf]">E-mail</div>
                  <div className="font-sans text-[15px] font-semibold leading-[1.5] text-knavy">{SITE.emails.mouvement}</div>
                  <div className="font-sans text-[15px] font-semibold leading-[1.5] text-knavy">{SITE.emails.gmail}</div>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-lg bg-klight px-5 py-[18px]">
                <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-kred text-[18px] text-white">✆</div>
                <div>
                  <div className="mb-2 font-sans text-[12px] font-bold uppercase tracking-[0.08em] leading-none text-[#9aa6bf]">Téléphone</div>
                  {SITE.telephones.map((t) => (
                    <div key={t} className="font-sans text-[15px] font-semibold leading-[1.5] text-knavy">{t}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* formulaire */}
          <div className="w-full max-w-[560px] flex-1 basis-[380px] overflow-hidden rounded-lg border border-[#e3e7ec] bg-white shadow-[0_6px_28px_rgba(17,32,63,.08)]">
            <div className="bg-kgreen px-7 py-5">
              <div className="font-heading text-[20px] font-bold uppercase tracking-[0.03em] leading-[1.1] text-white">Écrivez-nous</div>
            </div>

            {envoye ? (
              <div className="px-[clamp(22px,3vw,32px)] py-[clamp(34px,4vw,48px)] text-center">
                <div className="mx-auto mb-[22px] flex h-[66px] w-[66px] items-center justify-center rounded-full bg-kgreen text-[30px] leading-none text-white">✓</div>
                <h3 className="m-0 mb-3 font-heading text-[28px] font-bold uppercase leading-[1.05] text-knavy">Message prêt à l'envoi</h3>
                <p className="mx-auto mb-6 max-w-[360px] font-sans text-[17px] leading-[1.7] text-[#56607a]">
                  Votre logiciel de messagerie vient de s'ouvrir avec le message prérempli.
                  Vérifiez et envoyez-le. Vous pouvez aussi nous écrire directement à{' '}
                  <span className="font-semibold text-knavy">{SITE.emails.mouvement}</span>.
                </p>
                <Link to="/" className="inline-block rounded-md bg-kgreen px-[26px] py-[15px] font-sans text-[15px] font-bold leading-none text-white no-underline">Retour à l'accueil</Link>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="p-[clamp(22px,3vw,32px)]">
                <div className="mb-[14px] grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
                  <input type="text" placeholder="Nom complet" value={nom} onChange={(e) => setNom(e.target.value)} required className={champ} />
                  <input type="email" placeholder="Adresse e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required className={champ} />
                </div>
                <select value={sujet} onChange={(e) => setSujet(e.target.value)} className={`${champ} mb-[14px]`}>
                  <option value="">Sujet…</option>
                  {SUJETS.map((s) => <option key={s}>{s}</option>)}
                </select>
                <textarea placeholder="Votre message" rows={6} value={message} onChange={(e) => setMessage(e.target.value)} required
                  className="mb-5 w-full resize-y rounded-md border border-[#d7dce3] px-4 py-[13px] font-sans text-[15px] leading-[1.5] text-knavy outline-none focus:border-kgreen" />
                <button type="submit" className="w-full rounded-md bg-kgreen px-4 py-[17px] font-sans text-[16px] font-bold leading-none text-white">
                  Envoyer le message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
