import { NavLink, Outlet } from 'react-router-dom'
import { useCompareStore } from '../store/compare'
import { formatPokemonName } from '../utils/formatters'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-4 py-1.5 text-sm font-medium transition ${
    isActive ? 'bg-[#173EA5] text-white' : 'text-gray-600 hover:bg-gray-100'
  }`

export function Layout() {
  const slotA = useCompareStore((s) => s.slotA)
  const slotB = useCompareStore((s) => s.slotB)
  const hasSelection = slotA !== null || slotB !== null

  return (
    <div className="min-h-screen bg-[#F2F2F2]">
      <header className="sticky top-0 z-10 border-b border-[#F2F2F2] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <NavLink to="/" className="text-lg font-semibold">
            <span className="text-black">Poké</span>
            <span className="text-[#CD3131]">dex</span>
          </NavLink>
          <nav className="flex gap-2">
            <NavLink to="/" end className={navLinkClass}>
              Pokémons
            </NavLink>
            <NavLink to="/favoritos" className={navLinkClass}>
              Favoritos
            </NavLink>
            <NavLink to="/comparar" className={navLinkClass}>
              Comparar
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>

      {hasSelection && (
        <NavLink
          to="/comparar"
          className="fixed bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#173EA5] px-5 py-2.5 text-sm font-medium text-white shadow-lg"
        >
          Comparar{' '}
          {slotA ? formatPokemonName(slotA) : '?'} vs{' '}
          {slotB ? formatPokemonName(slotB) : '?'}
        </NavLink>
      )}
    </div>
  )
}
