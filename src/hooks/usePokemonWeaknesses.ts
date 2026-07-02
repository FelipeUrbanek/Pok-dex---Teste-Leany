import { useQuery } from '@tanstack/react-query'
import { getTypeByName } from '../api/pokeapi'
import type { PokemonType } from '../types/pokemon'

// Aproximação: une os tipos que causam dano dobrado contra cada tipo do
// Pokémon. Não calcula cancelamentos entre resistência e fraqueza quando o
// Pokémon tem dois tipos — para isso seria necessário multiplicar os fatores
// de dano dos dois tipos, o que fica fora do escopo deste case.
export function usePokemonWeaknesses(types: PokemonType[]) {
  return useQuery({
    queryKey: ['pokemon-weaknesses', ...types],
    queryFn: async () => {
      const responses = await Promise.all(types.map((type) => getTypeByName(type)))
      const weaknesses = new Set<string>()
      for (const response of responses) {
        for (const entry of response.damage_relations.double_damage_from) {
          weaknesses.add(entry.name)
        }
      }
      return Array.from(weaknesses) as PokemonType[]
    },
    enabled: types.length > 0,
  })
}
