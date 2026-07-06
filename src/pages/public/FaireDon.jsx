import { useState } from 'react'
import PageBanner from '../../components/public/PageBanner'
import Eyebrow from '../../components/public/Eyebrow'
import NewsletterForm from '../../components/public/NewsletterForm'
import { useT } from '../../i18n/LanguageContext'

// Page « Faire un don ». Présentationnelle : aucun prestataire de paiement
// n'est encore branché (à décider). L'interface du don est reproduite, mais la
// validation reste désactivée tant qu'un moyen de paiement n'est pas retenu.
// `sub` / `d` bilingues ({ fr, en }).
const MONTANTS = ['100', '2 000', '5 000', '10 000', '25 000', '50 000', '100 000']
const MOYENS = [
  { id: 'om', label: 'Orange Money', sub: { fr: 'Paiement mobile', en: 'Mobile payment' } },
  { id: 'momo', label: 'MTN MoMo', sub: { fr: 'Paiement mobile', en: 'Mobile payment' } },
  { id: 'card', label: { fr: 'Carte bancaire', en: 'Bank card' }, sub: { fr: 'Visa · Mastercard', en: 'Visa · Mastercard' } },
]
const PALIERS = [
  { m: '5 000 FCFA', d: { fr: 'contribuent au matériel de mobilisation.', en: 'contribute to mobilisation materials.' }, c: 'text-kgreen' },
  { m: '25 000 FCFA', d: { fr: 'aident à organiser une rencontre citoyenne.', en: 'help organise a citizens’ meeting.' }, c: 'text-kred' },
  { m: '50 000 FCFA', d: { fr: "soutiennent la logistique d'un événement.", en: 'support the logistics of an event.' }, c: 'text-[#b58f00]' },
]

export default function FaireDon() {
  const t = useT()
  const [freq, setFreq] = useState('unique')
  const [montant, setMontant] = useState('5 000')
  const [moyen, setMoyen] = useState('om')

  return (
    <>
      <PageBanner surtitre={t('Faire un don', 'Donate')} fil={t('Soutenir le mouvement', 'Support the movement')} />

      <section className="px-[clamp(16px,5vw,44px)] py-[clamp(40px,6vw,64px)]">
        <div className="mx-auto flex max-w-site flex-wrap items-start gap-[clamp(32px,5vw,56px)]">
          {/* message */}
          <div className="flex-1 basis-[340px]">
            <Eyebrow color="text-kred" dash className="mb-5">{t('Votre soutien compte', 'Your support matters')}</Eyebrow>
            <h1 className="m-0 mb-[22px] font-heading text-[clamp(38px,6vw,60px)] font-bold uppercase leading-[0.96] text-knavy">
              {t('Donnez pour un nouveau départ', 'Give for a new beginning')}
            </h1>
            <p className="m-0 mb-4 font-sans text-[18px] leading-[1.7] text-[#3b465c]">
              {t(
                'Le Mouvement Kamerun est financé par les citoyennes et les citoyens qui croient en un Cameroun souverain et prospère. Chaque contribution renforce notre action sur le terrain.',
                'Mouvement Kamerun is funded by the citizens who believe in a sovereign and prosperous Cameroon. Every contribution strengthens our action on the ground.',
              )}
            </p>
            <p className="m-0 mb-7 font-sans text-[17px] leading-[1.7] text-[#56607a]">
              {t(
                "Indépendance financière, transparence, proximité : votre don nous permet d'organiser des rencontres et de mobiliser partout au pays.",
                'Financial independence, transparency, closeness: your donation lets us organise meetings and mobilise across the country.',
              )}
            </p>
            <div className="flex flex-col gap-[14px] border-t border-[#e3e7ec] pt-6">
              {PALIERS.map((p) => (
                <div key={p.m} className="flex items-baseline gap-[14px]">
                  <span className={`w-[120px] flex-none font-heading text-[20px] font-bold leading-none ${p.c}`}>{p.m}</span>
                  <span className="font-sans text-[15px] leading-[1.5] text-[#56607a]">{t(p.d)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* carte de don */}
          <div className="w-full max-w-[480px] flex-1 basis-[380px] overflow-hidden rounded-lg border border-[#e3e7ec] bg-white shadow-[0_6px_28px_rgba(17,32,63,.08)]">
            <div className="bg-kgreen px-7 py-5">
              <div className="font-heading text-[20px] font-bold uppercase tracking-[0.03em] leading-[1.1] text-white">{t('Je fais un don', 'I make a donation')}</div>
            </div>
            <div className="p-[clamp(22px,3vw,30px)]">
              {/* fréquence */}
              <div className="mb-[10px] font-sans text-[13px] font-bold uppercase tracking-[0.06em] leading-none text-knavy">{t('Fréquence', 'Frequency')}</div>
              <div className="mb-6 flex rounded-md bg-[#eef1f5] p-1">
                {[['unique', t('Don unique', 'One-time')], ['mensuel', t('Mensuel', 'Monthly')]].map(([v, lbl]) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setFreq(v)}
                    className={`flex-1 rounded-[5px] py-[10px] font-sans text-[14px] font-bold leading-none transition-colors ${
                      freq === v ? 'bg-white text-knavy shadow-sm' : 'text-[#7c879c]'
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>

              {/* montant */}
              <div className="mb-[10px] font-sans text-[13px] font-bold uppercase tracking-[0.06em] leading-none text-knavy">{t('Montant', 'Amount')}</div>
              <div className="mb-3 grid grid-cols-3 gap-[10px]">
                {MONTANTS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMontant(m)}
                    className={`rounded-md border-2 py-[13px] font-sans text-[15px] font-bold leading-none ${
                      montant === m ? 'border-kgreen bg-kgreen/[0.06] text-kgreen' : 'border-[#d7dce3] text-knavy'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <div className="relative mb-6">
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder={t('Autre montant', 'Other amount')}
                  onChange={(e) => setMontant(e.target.value)}
                  className="w-full rounded-md border-2 border-[#d7dce3] py-[14px] pl-4 pr-16 font-sans text-[16px] font-semibold leading-none text-knavy outline-none focus:border-kgreen"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-sans text-[13px] font-bold leading-none text-[#9aa6bf]">FCFA</span>
              </div>

              {/* moyen de paiement */}
              <div className="mb-[10px] font-sans text-[13px] font-bold uppercase tracking-[0.06em] leading-none text-knavy">{t('Moyen de paiement', 'Payment method')}</div>
              <div className="mb-6 flex flex-col gap-[10px]">
                {MOYENS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMoyen(m.id)}
                    className={`flex items-center justify-between rounded-md border-2 px-4 py-3 text-left ${
                      moyen === m.id ? 'border-kgreen bg-kgreen/[0.04]' : 'border-[#d7dce3]'
                    }`}
                  >
                    <span className="flex flex-col gap-[3px]">
                      <span className="font-sans text-[15px] font-bold leading-none text-knavy">{t(m.label)}</span>
                      <span className="font-sans text-[12px] leading-none text-[#7c879c]">{t(m.sub)}</span>
                    </span>
                    <span className={`h-[18px] w-[18px] rounded-full border-2 ${moyen === m.id ? 'border-kgreen bg-kgreen' : 'border-[#d7dce3]'}`} />
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled
                title={t('Le paiement en ligne sera activé prochainement.', 'Online payment will be enabled soon.')}
                className="w-full cursor-not-allowed rounded-md bg-kgreen px-4 py-[18px] font-sans text-[17px] font-bold leading-none text-white opacity-60"
              >
                {t('Donner', 'Give')} {montant} FCFA {freq === 'mensuel' ? t('/ mois', '/ month') : ''}
              </button>
              <div className="mt-[14px] text-center font-sans text-[12px] leading-[1.4] text-[#7c879c]">
                <span className="font-bold text-kgreen">●</span> {t('Paiement en ligne bientôt disponible · Don au profit du MCNC', 'Online payment coming soon · Donation for the benefit of the MCNC')}
              </div>
            </div>
          </div>
        </div>
      </section>

      <NewsletterForm variant="light" />
    </>
  )
}
