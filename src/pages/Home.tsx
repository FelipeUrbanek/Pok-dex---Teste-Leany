import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import gsap from 'gsap'
import { usePokemonBrowse } from '../hooks/usePokemonBrowse'
import { useFiltersStore, type SortOption } from '../store/filters'
import { PokemonCard } from '../components/PokemonCard'
import { SearchBar } from '../components/SearchBar'
import { FilterSheet } from '../components/FilterSheet'
import { FilterModal } from '../components/FilterModal'
import { LoadMoreButton } from '../components/LoadMoreButton'
import { PokemonModal } from '../components/PokemonModal'
import { ChevronDownIcon, FilterIcon } from '../components/icons'

const SORT_LABELS: Record<SortOption, string> = {
  'id-asc': 'Menor número',
  'id-desc': 'Maior número',
  'name-asc': 'A-Z',
  'name-desc': 'Z-A',
}

export function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedName = searchParams.get('pokemon')
  const [openSheet, setOpenSheet] = useState<'sort' | null>(null)
  const [openFilterModal, setOpenFilterModal] = useState(false)

  const { search, types, generations, weight, height, sortBy, setSearch, setSortBy } = useFiltersStore()

  const { data, isLoading, isSourceLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePokemonBrowse({ search, types, generations, weight, height, sortBy })

  const items = data?.pages.flatMap((page) => page.items) ?? []
  const gridRef = useRef<HTMLDivElement>(null)
  const prevItemsLength = useRef(0)

  useEffect(() => {
    if (items.length > 0 && gridRef.current) {
      const cards = Array.from(gridRef.current.children)
      const newCards = cards.slice(prevItemsLength.current)
      
      if (newCards.length > 0) {
        gsap.fromTo(
          newCards,
          { opacity: 0, y: 30, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.05, ease: 'back.out(1.2)', overwrite: 'auto' }
        )
      }
      prevItemsLength.current = items.length
    }
  }, [items.length])

  function openPokemon(name: string) {
    setSearchParams((params) => {
      params.set('pokemon', name)
      return params
    })
  }

  function closeModal() {
    setSearchParams((params) => {
      params.delete('pokemon')
      return params
    })
  }

  const activeFiltersCount = types.length + generations.length + (weight ? 1 : 0) + (height ? 1 : 0)

  return (
    <div>
      <div className="mb-4">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      <div className="mb-6 flex gap-4">
        <button
          type="button"
          onClick={() => setOpenFilterModal(true)}
          className="relative flex h-[42px] flex-1 items-center justify-center gap-2 rounded-full bg-white border border-gray-200 px-4 text-sm font-bold text-gray-700 shadow-sm transition-all hover:bg-gray-50"
        >
          <FilterIcon className="h-4 w-4" />
          Filtros
          {activeFiltersCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#173EA5] text-[10px] font-black text-white">
              {activeFiltersCount}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setOpenSheet('sort')}
          className="flex h-[42px] flex-1 items-center justify-center gap-1.5 rounded-full bg-[#1A1A1A] px-4 text-sm font-medium text-white shadow-sm"
        >
          {SORT_LABELS[sortBy]}
          <ChevronDownIcon className="h-4 w-4" />
        </button>
      </div>

      {(isLoading || isSourceLoading) && (
        <p className="py-10 text-center text-sm font-medium text-gray-400">Carregando Pokémons...</p>
      )}

      {!isLoading && !isSourceLoading && items.length === 0 && (
        <p className="py-10 text-center text-sm font-medium text-gray-400">
          Nenhum Pokémon encontrado com esses filtros.
        </p>
      )}

      <div ref={gridRef} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} onSelect={openPokemon} />
        ))}
      </div>

      <LoadMoreButton
        onClick={() => fetchNextPage()}
        loading={isFetchingNextPage}
        disabled={!hasNextPage}
      />

      {selectedName && (
        <PokemonModal name={selectedName} onClose={closeModal} onSelectPokemon={openPokemon} />
      )}

      <FilterModal isOpen={openFilterModal} onClose={() => setOpenFilterModal(false)} />

      {openSheet === 'sort' && (
        <FilterSheet
          title="Selecione a ordem"
          selected={[sortBy]}
          onClose={() => setOpenSheet(null)}
          onToggle={(value) => {
            setSortBy(value as SortOption)
            setOpenSheet(null)
          }}
          options={(Object.keys(SORT_LABELS) as SortOption[]).map((value) => ({
            value,
            label: SORT_LABELS[value],
          }))}
        />
      )}
    </div>
  )
}
