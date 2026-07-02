import type {
  PokemonListResponse,
  RawEvolutionChain,
  RawPokemon,
  RawPokemonSpecies,
  RawTypeResponse,
} from './types'

const BASE_URL = 'https://pokeapi.co/api/v2'

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Falha ao buscar ${url}: ${response.status}`)
  }
  return response.json() as Promise<T>
}

export function getPokemonList(limit: number, offset: number) {
  return fetchJson<PokemonListResponse>(
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`,
  )
}

export function getPokemonByName(name: string) {
  return fetchJson<RawPokemon>(`${BASE_URL}/pokemon/${name}`)
}

export function getPokemonByUrl(url: string) {
  return fetchJson<RawPokemon>(url)
}

export function getSpeciesByName(name: string) {
  return fetchJson<RawPokemonSpecies>(`${BASE_URL}/pokemon-species/${name}`)
}

export function getEvolutionChainByUrl(url: string) {
  return fetchJson<RawEvolutionChain>(url)
}

export function getTypeByName(name: string) {
  return fetchJson<RawTypeResponse>(`${BASE_URL}/type/${name}`)
}

export const POKEMON_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
] as const
