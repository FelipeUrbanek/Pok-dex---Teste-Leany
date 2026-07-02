import { useQuery } from '@tanstack/react-query'
import { getPokemonByName, getSpeciesByName } from '../api/pokeapi'
import { toPokemonDetail } from '../utils/mappers'

export function usePokemonDetail(name: string | null) {
  return useQuery({
    queryKey: ['pokemon-detail', name],
    queryFn: async () => {
      const raw = await getPokemonByName(name!)
      const species = await getSpeciesByName(raw.species.name)
      return toPokemonDetail(raw, species)
    },
    enabled: name !== null,
  })
}
