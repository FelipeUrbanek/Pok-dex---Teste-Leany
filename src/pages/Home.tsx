import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { usePokemonBrowse } from '../hooks/usePokemonBrowse'
import { useFiltersStore, type SortOption } from '../store/filters'
import { POKEMON_TYPES } from '../api/pokeapi'
import { PokemonCard } from '../components/PokemonCard'
import { SearchBar } from '../components/SearchBar'
import { FilterSheet } from '../components/FilterSheet'
import { LoadMoreButton } from '../components/LoadMoreButton'
import { PokemonModal } from '../components/PokemonModal'
import { typeColor, typeLabel } from '../utils/typeColors'
import { ChevronDownIcon } from '../components/icons'

const SORT_LABELS: Record<SortOption, string> = {
  'id-asc': 'Menor número',
  'id-desc': 'Maior número',
  'name-asc': 'A-Z',
  'name-desc': 'Z-A',
}

export function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedName = searchParams.get('pokemon')
  const [openSheet, setOpenSheet] = useState<'type' | 'sort' | null>(null)

  const { search, type, sortBy, setSearch, setType, setSortBy } = useFiltersStore()

  const { data, isLoading, isSourceLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePokemonBrowse({ search, type, sortBy })

  const items = data?.pages.flatMap((page) => page.items) ?? []

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

  return (
    <div>
      <div className="mb-4">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      <div className="mb-6 flex gap-4">
        <button
          type="button"
          onClick={() => setOpenSheet('type')}
          className="flex h-[42px] flex-1 items-center justify-center gap-1.5 rounded-full px-4 text-sm font-medium text-white"
          style={{ backgroundColor: type ? typeColor(type) : '#1A1A1A' }}
        >
          {type ? typeLabel(type) : 'Todos os tipos'}
          <ChevronDownIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setOpenSheet('sort')}
          className="flex h-[42px] flex-1 items-center justify-center gap-1.5 rounded-full bg-[#1A1A1A] px-4 text-sm font-medium text-white"
        >
          {SORT_LABELS[sortBy]}
          <ChevronDownIcon className="h-4 w-4" />
        </button>
      </div>

      {(isLoading || isSourceLoading) && (
        <p className="py-10 text-center text-sm text-gray-400">Carregando Pokémons...</p>
      )}

      {!isLoading && !isSourceLoading && items.length === 0 && (
        <p className="py-10 text-center text-sm text-gray-400">
          Nenhum Pokémon encontrado com esses filtros.
        </p>
      )}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
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

      {openSheet === 'type' && (
        <FilterSheet
          title="Selecione o tipo"
          selected={type ? [type] : []}
          onClose={() => setOpenSheet(null)}
          onToggle={(value) => {
            setType(value === '' ? null : (value as NonNullable<typeof type>))
            setOpenSheet(null)
          }}
          options={[
            { value: '', label: 'Todos os tipos', color: '#1A1A1A' },
            ...POKEMON_TYPES.map((t) => ({
              value: t,
              label: typeLabel(t),
              color: typeColor(t),
              icon: t,
            })),
          ]}
        />
      )}

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
