import { NavLink, Outlet } from 'react-router-dom'
import { useCompareStore } from '../store/compare'
import { CompareIcon, HeartIcon, PokeballIcon } from './icons'

const tabLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex w-16 flex-col items-center gap-1 py-1 text-[11px] font-medium transition-colors ${
    isActive ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
  }`

export function Layout() {
  const slotA = useCompareStore((s) => s.slotA)
  const slotB = useCompareStore((s) => s.slotB)
  const selectionCount = (slotA ? 1 : 0) + (slotB ? 1 : 0)
  const hasSelection = selectionCount > 0

  return (
    <div className="min-h-screen bg-[#F2F2F2] pb-20">
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>

      {/* Floating button removed */}

      <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-gray-100 bg-white">
        <div className="mx-auto flex max-w-5xl justify-around px-4 py-2">
          <NavLink to="/" end className={tabLinkClass}>
            <PokeballIcon className="h-6 w-6" />
            Pokédex
          </NavLink>
          <NavLink to="/comparar" className={tabLinkClass}>
            <div className="relative">
              <CompareIcon className="h-6 w-6" />
              {hasSelection && (
                <span className="absolute -right-2 -top-1 flex h-4 w-4 animate-bounce items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-lg ring-2 ring-white">
                  {selectionCount}
                </span>
              )}
            </div>
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
