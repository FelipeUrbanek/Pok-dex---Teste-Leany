// Formato bruto das respostas da PokeAPI (só os campos que a gente realmente usa)

export interface NamedAPIResource {
  name: string
  url: string
}

export interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: NamedAPIResource[]
}

export interface PokemonSprites {
  front_default: string | null
  other: {
    'official-artwork': {
      front_default: string | null
    }
  }
}

export interface PokemonTypeSlot {
  slot: number
  type: NamedAPIResource
}

export interface PokemonStatEntry {
  base_stat: number
  stat: NamedAPIResource
}

export interface PokemonAbilitySlot {
  ability: NamedAPIResource
  is_hidden: boolean
}

export interface RawPokemon {
  id: number
  name: string
  height: number
  weight: number
  sprites: PokemonSprites
  types: PokemonTypeSlot[]
  stats: PokemonStatEntry[]
  abilities: PokemonAbilitySlot[]
  species: NamedAPIResource
}

export interface RawPokemonSpecies {
  id: number
  name: string
  generation: NamedAPIResource
  evolution_chain: { url: string }
  gender_rate: number
  genera: {
    genus: string
    language: NamedAPIResource
  }[]
  flavor_text_entries: {
    flavor_text: string
    language: NamedAPIResource
  }[]
}

export interface EvolutionChainLink {
  species: NamedAPIResource
  evolves_to: EvolutionChainLink[]
  evolution_details: {
    min_level: number | null
    trigger: NamedAPIResource | null
    item: NamedAPIResource | null
  }[]
}

export interface RawEvolutionChain {
  id: number
  chain: EvolutionChainLink
}

export interface RawTypeResponse {
  name: string
  pokemon: { pokemon: NamedAPIResource; slot: number }[]
  damage_relations: {
    double_damage_from: NamedAPIResource[]
    half_damage_from: NamedAPIResource[]
    no_damage_from: NamedAPIResource[]
  }
}
