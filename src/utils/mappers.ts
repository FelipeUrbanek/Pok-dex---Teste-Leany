import type { RawPokemon, RawPokemonSpecies } from '../api/types'
import type { PokemonDetail, PokemonStat, PokemonSummary, PokemonType } from '../types/pokemon'
import { formatPokemonName } from './formatters'

function getSprite(raw: RawPokemon): string {
  return (
    raw.sprites.other['official-artwork'].front_default ??
    raw.sprites.front_default ??
    ''
  )
}

function getGenus(species: RawPokemonSpecies | undefined): string {
  if (!species) return ''
  const entry =
    species.genera.find((g) => g.language.name === 'pt-br') ??
    species.genera.find((g) => g.language.name === 'en')
  return entry?.genus ?? ''
}

function getDescription(species: RawPokemonSpecies | undefined): string {
  if (!species) return ''
  const entry =
    species.flavor_text_entries.find((f) => f.language.name === 'pt-br') ??
    species.flavor_text_entries.find((f) => f.language.name === 'en')
  return entry?.flavor_text.replace(/[\n\f\r]+/g, ' ') ?? ''
}

export function toPokemonSummary(raw: RawPokemon): PokemonSummary {
  return {
    id: raw.id,
    name: raw.name,
    sprite: getSprite(raw),
    types: raw.types.map((t) => t.type.name as PokemonType),
  }
}

export function toPokemonDetail(raw: RawPokemon, species?: RawPokemonSpecies): PokemonDetail {
  const stats: PokemonStat[] = raw.stats.map((s) => ({
    name: s.stat.name as PokemonStat['name'],
    base: s.base_stat,
  }))

  const ability = raw.abilities.find((a) => !a.is_hidden) ?? raw.abilities[0]

  return {
    ...toPokemonSummary(raw),
    artwork: getSprite(raw),
    heightM: raw.height / 10,
    weightKg: raw.weight / 10,
    stats,
    speciesName: raw.species.name,
    ability: ability ? formatPokemonName(ability.ability.name) : '—',
    category: getGenus(species),
    description: getDescription(species),
  }
}

export function idFromUrl(url: string): number {
  const parts = url.split('/').filter(Boolean)
  return Number(parts[parts.length - 1])
}
