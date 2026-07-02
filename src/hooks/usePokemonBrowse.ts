import { useInfiniteQuery, useQuery, keepPreviousData } from '@tanstack/react-query'
import { getPokemonByUrl } from '../api/pokeapi'
import { toPokemonSummary, idFromUrl } from '../utils/mappers'
import { usePokemonNameIndex } from './usePokemonNameIndex'
import type { NamedAPIResource } from '../api/types'
import type { PokemonSummary, PokemonType } from '../types/pokemon'
import type { SortOption, WeightRange, HeightRange } from '../store/filters'

const PAGE_SIZE = 20

interface BrowseParams {
  search: string
  types: PokemonType[]
  generations: number[]
  weight: WeightRange | null
  height: HeightRange | null
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

async function fetchGraphQLFiltered(params: BrowseParams): Promise<NamedAPIResource[]> {
  const where: any = { is_default: { _eq: true } }

  if (params.search) {
    where.name = { _ilike: `%${params.search}%` }
  }

  if (params.types && params.types.length > 0) {
    where.pokemon_v2_pokemontypes = {
      pokemon_v2_type: { name: { _in: params.types } },
    }
  }

  if (params.generations && params.generations.length > 0) {
    where.pokemon_v2_pokemonspecy = {
      generation_id: { _in: params.generations },
    }
  }

  if (params.weight) {
    where.weight = {}
    if (params.weight.min !== undefined) where.weight._gte = params.weight.min
    if (params.weight.max !== undefined) where.weight._lte = params.weight.max
  }

  if (params.height) {
    where.height = {}
    if (params.height.min !== undefined) where.height._gte = params.height.min
    if (params.height.max !== undefined) where.height._lte = params.height.max
  }

  const query = `
    query getPokemonList($where: pokemon_v2_pokemon_bool_exp) {
      pokemon_v2_pokemon(where: $where) {
        id
        name
      }
    }
  `

  const res = await fetch('https://beta.pokeapi.co/graphql/v1beta', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { where } }),
  })

  const json = await res.json()
  if (json.errors) {
    throw new Error('GraphQL query failed: ' + json.errors[0].message)
  }

  return json.data.pokemon_v2_pokemon.map((p: any) => ({
    name: p.name,
    url: `https://pokeapi.co/api/v2/pokemon/${p.id}/`,
  }))
}

export function usePokemonBrowse(params: BrowseParams) {
  const nameIndex = usePokemonNameIndex()
  const { search, types, generations, weight, height, sortBy } = params

  const hasAdvancedFilters =
    types.length > 0 || generations.length > 0 || weight !== null || height !== null

  const advancedQuery = useQuery({
    queryKey: ['pokemon-advanced-filter', search, types, generations, weight, height],
    queryFn: () => fetchGraphQLFiltered(params),
    enabled: hasAdvancedFilters,
    staleTime: 60 * 60 * 1000,
    placeholderData: keepPreviousData,
  })

  let source: NamedAPIResource[] | undefined
  let isSourceLoading = false

  if (hasAdvancedFilters) {
    source = advancedQuery.data
    isSourceLoading = advancedQuery.isLoading
  } else {
    isSourceLoading = nameIndex.isLoading
    const normalizedSearch = search.trim().toLowerCase()
    if (normalizedSearch) {
      source = nameIndex.data?.filter((p) => p.name.includes(normalizedSearch))
    } else {
      source = nameIndex.data
    }
  }

  if (source) {
    source = sortResources(source, sortBy)
  }

  const query = useInfiniteQuery({
    queryKey: ['pokemon-browse', search, types, generations, weight, height, sortBy, source?.length ?? 0],
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
    placeholderData: keepPreviousData,
  })

  return { ...query, isSourceLoading }
}
