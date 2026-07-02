import { useQuery } from '@tanstack/react-query'
import {
  getEvolutionChainByUrl,
  getPokemonByName,
  getSpeciesByName,
} from '../api/pokeapi'
import { toPokemonSummary } from '../utils/mappers'
import type { EvolutionChainLink } from '../api/types'
import type { EvolutionNode } from '../types/pokemon'

interface FlatNode {
  name: string
  minLevel: number | null
}

function flattenChain(link: EvolutionChainLink): FlatNode[] {
  const result: FlatNode[] = []

  function walk(node: EvolutionChainLink, minLevel: number | null) {
    result.push({ name: node.species.name, minLevel })
    for (const child of node.evolves_to) {
      walk(child, child.evolution_details[0]?.min_level ?? null)
    }
  }

  walk(link, null)
  return result
}

export function useEvolutionChain(speciesName: string | null) {
  return useQuery<EvolutionNode[]>({
    queryKey: ['evolution-chain', speciesName],
    queryFn: async () => {
      const species = await getSpeciesByName(speciesName!)
      const chain = await getEvolutionChainByUrl(species.evolution_chain.url)
      const flat = flattenChain(chain.chain)

      return Promise.all(
        flat.map(async (node) => {
          const raw = await getPokemonByName(node.name)
          const summary = toPokemonSummary(raw)
          return {
            id: summary.id,
            name: summary.name,
            sprite: summary.sprite,
            types: summary.types,
            minLevel: node.minLevel,
          }
        }),
      )
    },
    enabled: speciesName !== null,
  })
}
