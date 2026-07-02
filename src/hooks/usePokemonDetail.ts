import { useQuery } from '@tanstack/react-query'
import { getPokemonByName, getSpeciesByName } from '../api/pokeapi'
import { toPokemonDetail } from '../utils/mappers'
import { translateText } from '../utils/translate'

export function usePokemonDetail(name: string | null) {
  return useQuery({
    queryKey: ['pokemon-detail', name],
    queryFn: async () => {
      const raw = await getPokemonByName(name!)
      const species = await getSpeciesByName(raw.species.name)
      const detail = toPokemonDetail(raw, species)
      
      detail.description = translateText(detail.description)
      detail.category = translateText(detail.category)
      detail.ability = translateText(detail.ability)
      
      return detail
    },
    enabled: name !== null,
  })
}
