import type { PokemonType } from '../types/pokemon'

export const TYPE_COLORS: Record<PokemonType, string> = {
  grass: '#63BC5A',
  poison: '#B567CE',
  fire: '#FF9D55',
  flying: '#89AAE3',
  psychic: '#FA7179',
  ice: '#73CEC0',
  bug: '#91C12F',
  fighting: '#CE416B',
  steel: '#5A8EA2',
  dark: '#5A5465',
  water: '#5090D3',
  electric: '#EDD53F',
  fairy: '#EC8FE6',
  ghost: '#5269AC',
  dragon: '#0F6AC0',
  normal: '#9099A1',
  rock: '#C9BB8A',
  ground: '#DA7C4D',
}

export const TYPE_LABELS_PT: Record<PokemonType, string> = {
  grass: 'Grama',
  poison: 'Venenoso',
  fire: 'Fogo',
  flying: 'Voador',
  psychic: 'Psíquico',
  ice: 'Gelo',
  bug: 'Inseto',
  fighting: 'Lutador',
  steel: 'Metal',
  dark: 'Noturno',
  water: 'Água',
  electric: 'Elétrico',
  fairy: 'Fada',
  ghost: 'Fantasma',
  dragon: 'Dragão',
  normal: 'Normal',
  rock: 'Pedra',
  ground: 'Terrestre',
}

export function typeColor(type: PokemonType): string {
  return TYPE_COLORS[type] ?? '#777777'
}

export function typeLabel(type: PokemonType): string {
  return TYPE_LABELS_PT[type] ?? type
}

export function typeTint(type: PokemonType): string {
  return `${typeColor(type)}1F`
}
