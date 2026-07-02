export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function formatPokemonName(name: string): string {
  return name
    .split('-')
    .map(capitalize)
    .join(' ')
}

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Ataque',
  defense: 'Defesa',
  'special-attack': 'Ataque Esp.',
  'special-defense': 'Defesa Esp.',
  speed: 'Velocidade',
}

export function formatStatName(name: string): string {
  return STAT_LABELS[name] ?? capitalize(name)
}

export function formatId(id: number): string {
  return `#${String(id).padStart(3, '0')}`
}
