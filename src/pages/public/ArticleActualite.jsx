import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageBanner from '../../components/public/PageBanner'
import StateMessage from '../../components/public/StateMessage'
import Reveal from '../../components/ui/Reveal'
import { Skeleton } from '../../components/ui/Skeleton'
import { formatDateLongue } from '../../lib/dates'
import { getActualite } from '../../lib/content'
import { useLang } from '../../i18n/LanguageContext'

export default function ArticleActualite() {
  const { id } = useParams()
  const { lang, t } = useLang()
  // undefined = en cours, null = introuvable, objet = article chargé
  const [article, setArticle] = useState(undefined)

  useEffect(() => {
    let actif = true
    setArticle(undefined)
    getActualite(id)
      .then((a) => actif && setArticle(a))
      .catch(() => actif && setArticle(null))
    return () => {
      actif = false
    }
  }, [id])

  // Titre / contenu dans la langue courante (repli sur le FR si l'EN manque).
  const titre = article && t({ fr: article.titre, en: article.titre_en || article.titre })
  const contenu = article && t({ fr: article.contenu, en: article.contenu_en || article.contenu })

  // Paragraphes : on découpe le contenu sur les sauts de ligne.
  const paragraphes =
    contenu
      ?.split(/\n{2,}|\n/)
      .map((p) => p.trim())
      .filter(Boolean) ?? []

  return (
    <>
      <PageBanner surtitre={t('Actualités', 'News')} fil={t('Actualités', 'News')} />

      <section className="px-[clamp(16px,5vw,44px)] pb-[clamp(40px,6vw,72px)] pt-[clamp(32px,5vw,52px)]">
        <div className="mx-auto max-w-[820px]">
          <Link
            to="/actualites"
            className="mb-7 inline-flex items-center gap-2 font-sans text-[14px] font-bold leading-none text-kgreen no-underline hover:opacity-80"
          >
            <span className="text-[18px]">←</span> {t('Retour aux actualités', 'Back to news')}
          </Link>

          {article === undefined ? (
            <div className="flex flex-col gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-12 w-4/5" />
              <Skeleton className="mt-2 h-[320px] w-full rounded-md" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : article === null ? (
            <StateMessage>
              {t("Cet article n'existe pas ou n'est plus disponible.", 'This article does not exist or is no longer available.')}
            </StateMessage>
          ) : (
            <Reveal as="article">
              <div className="mb-4 font-sans text-[13px] font-semibold uppercase leading-none tracking-[0.1em] text-kfaint">
                {formatDateLongue(article.created_at, lang)}
              </div>
              <h1 className="m-0 mb-7 font-heading text-[clamp(30px,5vw,46px)] font-bold uppercase leading-[1.04] text-knavy">
                {titre}
              </h1>

              {article.image_url && (
                <img
                  src={article.image_url}
                  alt=""
                  className="mb-8 w-full rounded-md object-cover"
                />
              )}

              {paragraphes.length > 0 ? (
                <div className="flex flex-col gap-5">
                  {paragraphes.map((p, i) => (
                    <p key={i} className="m-0 font-sans text-[17px] leading-[1.8] text-[#3b465c]">
                      {p}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="m-0 font-sans text-[15px] italic text-kfaint">
                  {t('Aucun contenu pour cet article.', 'No content for this article.')}
                </p>
              )}
            </Reveal>
          )}
        </div>
      </section>
    </>
  )
}
