import type { POKEMON_TYPES } from '../api/pokeapi'

export type PokemonType = (typeof POKEMON_TYPES)[number]

export type StatName =
  | 'hp'
  | 'attack'
  | 'defense'
  | 'special-attack'
  | 'special-defense'
  | 'speed'

export interface PokemonStat {
  name: StatName
  base: number
}

export interface PokemonSummary {
  id: number
  name: string
  sprite: string
  types: PokemonType[]
}

export interface PokemonDetail extends PokemonSummary {
  artwork: string
  heightM: number
  weightKg: number
  stats: PokemonStat[]
  speciesName: string
  ability: string
  category: string
}

export interface PokemonSpeciesInfo {
  generation: string
  evolutionChainUrl: string
  description: string
}

export interface EvolutionNode {
  id: number
  name: string
  sprite: string
  types: PokemonType[]
  minLevel: number | null
}
