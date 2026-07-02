import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { getPokemonByUrl, getTypeByName } from '../api/pokeapi'
import { toPokemonSummary, idFromUrl } from '../utils/mappers'
import { usePokemonNameIndex } from './usePokemonNameIndex'
import type { NamedAPIResource } from '../api/types'
import type { PokemonSummary, PokemonType } from '../types/pokemon'
import type { SortOption } from '../store/filters'

const PAGE_SIZE = 20

interface BrowseParams {
  search: string
  type: PokemonType | null
  sortBy: SortOption
}

interface BrowsePage {
  items: PokemonSummary[]
  nextOffset: number | null
}

function sortResources(list: NamedAPIResource[], sortBy: SortOption): NamedAPIResource[] {
  const sorted = [...list]
  switch (sortBy) {
    case 'id-desc':
      return sorted.sort((a, b) => idFromUrl(b.url) - idFromUrl(a.url))
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name))
    default:
      return sorted.sort((a, b) => idFromUrl(a.url) - idFromUrl(b.url))
  }
}

export function usePokemonBrowse({ search, type, sortBy }: BrowseParams) {
  const nameIndex = usePokemonNameIndex()

  const typeQuery = useQuery({
    queryKey: ['pokemon-type', type],
    queryFn: () => getTypeByName(type!),
    enabled: type !== null,
  })

  const normalizedSearch = search.trim().toLowerCase()

  let source: NamedAPIResource[] | undefined
  if (normalizedSearch && type) {
    const typeNames = new Set(typeQuery.data?.pokemon.map((p) => p.pokemon.name))
    source = nameIndex.data?.filter(
      (p) => p.name.includes(normalizedSearch) && typeNames.has(p.name),
    )
  } else if (normalizedSearch) {
    source = nameIndex.data?.filter((p) => p.name.includes(normalizedSearch))
  } else if (type) {
    source = typeQuery.data?.pokemon.map((p) => p.pokemon)
  } else {
    source = nameIndex.data
  }

  if (source) {
    source = sortResources(source, sortBy)
  }

  const isSourceLoading =
    nameIndex.isLoading || (type !== null && typeQuery.isLoading)

  const query = useInfiniteQuery({
    queryKey: ['pokemon-browse', normalizedSearch, type, sortBy, source?.length ?? 0],
    queryFn: async ({ pageParam }): Promise<BrowsePage> => {
      const slice = source!.slice(pageParam, pageParam + PAGE_SIZE)
      const details = await Promise.all(
        slice.map((resource) => getPokemonByUrl(resource.url)),
      )
      return {
        items: details.map(toPokemonSummary),
        nextOffset:
          pageParam + PAGE_SIZE < source!.length ? pageParam + PAGE_SIZE : null,
      }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    enabled: source !== undefined,
  })

  return { ...query, isSourceLoading }
}
