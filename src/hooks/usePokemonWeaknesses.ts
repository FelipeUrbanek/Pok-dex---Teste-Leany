import { useQuery } from '@tanstack/react-query'
import { getTypeByName, POKEMON_TYPES } from '../api/pokeapi'
import type { PokemonType } from '../types/pokemon'

function multiplierAgainst(attackingType: PokemonType, relationsList: RelationsShape[]): number {
  let multiplier = 1
  for (const relations of relationsList) {
    if (relations.double_damage_from.some((t) => t.name === attackingType)) {
      multiplier *= 2
    } else if (relations.half_damage_from.some((t) => t.name === attackingType)) {
      multiplier *= 0.5
    } else if (relations.no_damage_from.some((t) => t.name === attackingType)) {
      multiplier *= 0
    }
  }
  return multiplier
}

interface RelationsShape {
  double_damage_from: { name: string }[]
  half_damage_from: { name: string }[]
  no_damage_from: { name: string }[]
}

// Calcula a fraqueza combinando os multiplicadores de dano dos dois tipos do
// Pokémon (igual ao jogo): um tipo que a Pokémon resiste pode cancelar uma
// fraqueza do outro tipo, e vice-versa.
export function usePokemonWeaknesses(types: PokemonType[]) {
  return useQuery({
    queryKey: ['pokemon-weaknesses', ...types],
    queryFn: async () => {
      const responses = await Promise.all(types.map((type) => getTypeByName(type)))
      const relationsList = responses.map((r) => r.damage_relations)
      return POKEMON_TYPES.filter((type) => multiplierAgainst(type, relationsList) > 1)
    },
    enabled: types.length > 0,
  })
}
