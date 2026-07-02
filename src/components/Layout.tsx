import { NavLink, Outlet } from 'react-router-dom'
import { useCompareStore } from '../store/compare'
import { formatPokemonName } from '../utils/formatters'
import { CompareIcon, HeartIcon, PokeballIcon } from './icons'

const tabLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex w-16 flex-col items-center gap-1 py-1 text-[11px] font-medium ${
    isActive ? 'text-[#173EA5]' : 'text-gray-400'
  }`

export function Layout() {
  const slotA = useCompareStore((s) => s.slotA)
  const slotB = useCompareStore((s) => s.slotB)
  const hasSelection = slotA !== null || slotB !== null

  return (
    <div className="min-h-screen bg-[#F2F2F2] pb-20">
      <header className="sticky top-0 z-10 border-b border-[#F2F2F2] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center px-4 py-4">
          <NavLink to="/" className="text-lg font-semibold">
            <span className="text-black">Poké</span>
            <span className="text-[#CD3131]">dex</span>
          </NavLink>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>

      {hasSelection && (
        <NavLink
          to="/comparar"
          className="fixed bottom-20 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#173EA5] px-5 py-2.5 text-sm font-medium text-white shadow-lg"
        >
          Comparar {slotA ? formatPokemonName(slotA) : '?'} vs{' '}
          {slotB ? formatPokemonName(slotB) : '?'}
        </NavLink>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-gray-100 bg-white">
        <div className="mx-auto flex max-w-5xl justify-around px-4 py-2">
          <NavLink to="/" end className={tabLinkClass}>
            <PokeballIcon className="h-6 w-6" />
            Pokédex
          </NavLink>
          <NavLink to="/comparar" className={tabLinkClass}>
            <CompareIcon className="h-6 w-6" />
            Comparar
          </NavLink>
          <NavLink to="/favoritos" className={tabLinkClass}>
            {({ isActive }) => (
              <>
                <HeartIcon
                  filled={isActive}
                  outlineColor={isActive ? '#CD3131' : '#9CA3AF'}
                  className="h-6 w-6"
                />
                Favoritos
              </>
            )}
          </NavLink>
        </div>
      </nav>
    </div>
  )
}
