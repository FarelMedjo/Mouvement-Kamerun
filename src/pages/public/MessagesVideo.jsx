import { useEffect, useState } from 'react'
import PageBanner from '../../components/public/PageBanner'
import StateMessage from '../../components/public/StateMessage'
import Reveal from '../../components/ui/Reveal'
import { Skeleton } from '../../components/ui/Skeleton'
import { getMessagesVideo } from '../../lib/content'
import { useLang } from '../../i18n/LanguageContext'

// Page listant tous les messages vidéo (YouTube) chargés par l'admin.
// Même rendu que l'aperçu de l'accueil : miniature + bouton lecture -> iframe.
export default function MessagesVideo() {
  const { lang, t } = useLang()
  const [videos, setVideos] = useState(null) // null = chargement
  const [videoActive, setVideoActive] = useState(null) // id de la vidéo en lecture

  useEffect(() => {
    getMessagesVideo()
      .then(setVideos)
      .catch(() => setVideos([]))
  }, [])

  return (
    <>
      <PageBanner surtitre={t('Messages vidéo', 'Video messages')} fil={t('Messages vidéo', 'Video messages')} />

      <section className="px-[clamp(16px,5vw,44px)] pb-[clamp(40px,6vw,60px)] pt-[clamp(40px,6vw,60px)]">
        <div className="mx-auto max-w-site">
          {videos === null ? (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-x-6 gap-y-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="aspect-video w-full rounded-[4px]" />
                  <Skeleton className="mt-[10px] h-4 w-4/5" />
                </div>
              ))}
            </div>
          ) : videos.length === 0 ? (
            <StateMessage>{t('Aucune vidéo publiée pour le moment.', 'No video published yet.')}</StateMessage>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-x-6 gap-y-8">
              {videos.map((v, i) => {
                const ytId = lang === 'en' && v.youtube_id_en ? v.youtube_id_en : v.youtube_id
                const titre = lang === 'en' && v.titre_en ? v.titre_en : v.titre
                return (
                  <Reveal key={v.id} delay={(i % 3) * 90}>
                    <div className="relative aspect-video overflow-hidden rounded-[4px] bg-[#cdd4dd]">
                      {videoActive === v.id ? (
                        <iframe
                          className="absolute inset-0 h-full w-full"
                          src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`}
                          title={titre}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => setVideoActive(v.id)}
                          aria-label={t(`Lire la vidéo : ${titre}`, `Play video: ${titre}`)}
                          className="group absolute inset-0 flex items-center justify-center"
                        >
                          <img
                            src={`https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`}
                            alt=""
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                          <span className="relative flex h-[52px] w-[52px] items-center justify-center rounded-full bg-kgreen text-white shadow-[0_4px_14px_rgba(0,0,0,.35)] transition-transform duration-200 group-hover:scale-110">
                            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </span>
                        </button>
                      )}
                    </div>
                    <p className="m-0 mt-[10px] font-sans text-[15px] font-bold leading-[1.35] text-knavy">
                      {titre}
                    </p>
                  </Reveal>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
