import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Logo from './Logo'
import UtilityBar from './UtilityBar'
import { NAV_PRINCIPALE } from '../../config/site'
import { useT } from '../../i18n/LanguageContext'

// En-tête sticky : barre utilitaire + logo + navigation principale + CTA.
// Le menu mobile (hamburger) est géré par un état local.
export default function Header() {
  const [showMenu, setShowMenu] = useState(false)
  const t = useT()

  const desktopLinkClass = ({ isActive }) =>
    [
      'no-underline font-sans text-[14px] font-semibold leading-none transition-colors duration-200',
      isActive
        ? 'text-kgreen border-b-2 border-kgreen pb-[3px]'
        : 'text-kink hover:text-kgreen',
    ].join(' ')

  const mobileLinkClass = ({ isActive }) =>
    [
      'no-underline font-sans text-[16px] font-semibold leading-none py-[14px] border-b border-[#f0f2f5] transition-colors duration-200',
      isActive ? 'text-kgreen' : 'text-kink hover:text-kgreen',
    ].join(' ')

  return (
    <header className="sticky top-0 z-50 border-b border-kline bg-white">
      <UtilityBar />

      <div className="mx-auto flex max-w-site items-center justify-between gap-4 px-[clamp(16px,5vw,44px)] py-4">
        <Logo />

        {/* Navigation bureau */}
        <nav className="hidden items-center gap-[26px] lg:flex">
          {NAV_PRINCIPALE.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={desktopLinkClass}>
              {t(item.label)}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/faire-un-don"
          className="hidden whitespace-nowrap rounded-[3px] bg-kgreen px-[22px] py-[13px] font-sans text-[14px] font-bold leading-none tracking-[0.02em] text-white no-underline transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#095638] hover:shadow-[0_6px_16px_rgba(11,107,67,.28)] lg:inline-block"
        >
          {t('Soutenez-nous', 'Support us')}
        </Link>

        {/* Bouton menu mobile — les trois traits se muent en croix à l'ouverture */}
        <button
          type="button"
          onClick={() => setShowMenu((v) => !v)}
          aria-label="Menu"
          aria-expanded={showMenu}
          className="flex h-[42px] w-[46px] flex-none flex-col items-center justify-center gap-[5px] rounded bg-kgreen lg:hidden"
        >
          <span
            className={`block h-[2px] w-5 bg-white transition-transform duration-300 ${
              showMenu ? 'translate-y-[7px] rotate-45' : ''
            }`}
          />
          <span
            className={`block h-[2px] w-5 bg-white transition-opacity duration-200 ${
              showMenu ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`block h-[2px] w-5 bg-white transition-transform duration-300 ${
              showMenu ? '-translate-y-[7px] -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      {/* Menu déroulant mobile — toujours monté, animé par grid-template-rows
          (0fr → 1fr) pour une ouverture/fermeture fluide en hauteur. */}
      <div
        className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out lg:hidden ${
          showMenu ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <nav
          aria-hidden={!showMenu}
          className={`flex min-h-0 flex-col border-t border-kline bg-white px-[clamp(16px,5vw,44px)] pb-[18px] pt-[10px] transition-opacity duration-300 ${
            showMenu ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {NAV_PRINCIPALE.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              tabIndex={showMenu ? 0 : -1}
              className={mobileLinkClass}
              onClick={() => setShowMenu(false)}
            >
              {t(item.label)}
            </NavLink>
          ))}
          <Link
            to="/faire-un-don"
            onClick={() => setShowMenu(false)}
            tabIndex={showMenu ? 0 : -1}
            className="mt-[14px] rounded-[3px] bg-kgreen px-[22px] py-[15px] text-center font-sans text-[15px] font-bold leading-none text-white no-underline transition-colors hover:bg-[#095638]"
          >
            Soutenez-nous
          </Link>
        </nav>
      </div>
    </header>
  )
}
