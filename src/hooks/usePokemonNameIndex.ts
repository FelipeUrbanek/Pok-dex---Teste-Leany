import { useQuery } from '@tanstack/react-query'
import { getPokemonList } from '../api/pokeapi'

// A PokeAPI não tem um endpoint de busca por texto, então carregamos o índice
// completo de nomes uma única vez (é uma resposta leve, só name + url) e
// filtramos no client. Os detalhes de cada Pokémon continuam sendo buscados
// sob demanda, só para os itens que aparecem na página atual.
export function usePokemonNameIndex() {
  return useQuery({
    queryKey: ['pokemon-name-index'],
    queryFn: async () => {
      const res = await getPokemonList(2000, 0)
      return res.results
    },
    staleTime: Infinity,
  })
}
