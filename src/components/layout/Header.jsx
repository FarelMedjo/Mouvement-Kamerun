import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Logo from './Logo'
import UtilityBar from './UtilityBar'
import { NAV_PRINCIPALE } from '../../config/site'

// En-tête sticky : barre utilitaire + logo + navigation principale + CTA.
// Le menu mobile (hamburger) est géré par un état local.
export default function Header() {
  const [showMenu, setShowMenu] = useState(false)

  const desktopLinkClass = ({ isActive }) =>
    [
      'no-underline font-sans text-[14px] font-semibold leading-none',
      isActive
        ? 'text-kgreen border-b-2 border-kgreen pb-[3px]'
        : 'text-kink hover:text-kgreen',
    ].join(' ')

  const mobileLinkClass = ({ isActive }) =>
    [
      'no-underline font-sans text-[16px] font-semibold leading-none py-[14px] border-b border-[#f0f2f5]',
      isActive ? 'text-kgreen' : 'text-kink',
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
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/faire-un-don"
          className="hidden whitespace-nowrap rounded-[3px] bg-kgreen px-[22px] py-[13px] font-sans text-[14px] font-bold leading-none tracking-[0.02em] text-white no-underline lg:inline-block"
        >
          Soutenez-nous
        </Link>

        {/* Bouton menu mobile */}
        <button
          type="button"
          onClick={() => setShowMenu((v) => !v)}
          aria-label="Menu"
          aria-expanded={showMenu}
          className="flex h-[42px] w-[46px] flex-none flex-col items-center justify-center gap-[5px] rounded bg-kgreen lg:hidden"
        >
          <span className="block h-[2px] w-5 bg-white" />
          <span className="block h-[2px] w-5 bg-white" />
          <span className="block h-[2px] w-5 bg-white" />
        </button>
      </div>

      {/* Menu déroulant mobile */}
      {showMenu && (
        <nav className="flex flex-col border-t border-kline bg-white px-[clamp(16px,5vw,44px)] pb-[18px] pt-[10px] lg:hidden">
          {NAV_PRINCIPALE.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={mobileLinkClass}
              onClick={() => setShowMenu(false)}
            >
              {item.label}
            </NavLink>
          ))}
          <Link
            to="/faire-un-don"
            onClick={() => setShowMenu(false)}
            className="mt-[14px] rounded-[3px] bg-kgreen px-[22px] py-[15px] text-center font-sans text-[15px] font-bold leading-none text-white no-underline"
          >
            Soutenez-nous
          </Link>
        </nav>
      )}
    </header>
  )
}
