import { useEvolutionChain } from '../hooks/useEvolutionChain'
import { formatId, formatPokemonName } from '../utils/formatters'
import { typeColor } from '../utils/typeColors'
import { ChevronDownIcon } from './icons'

interface Props {
  speciesName: string
  onSelect: (name: string) => void
}

export function EvolutionChain({ speciesName, onSelect }: Props) {
  const { data, isLoading } = useEvolutionChain(speciesName)

  if (isLoading) {
    return <p className="text-sm text-gray-400">Carregando evolução...</p>
  }

  if (!data || data.length <= 1) {
    return <p className="text-sm text-gray-400">Este Pokémon não evolui.</p>
  }

  return (
    <div className="rounded-2xl border border-gray-200 p-3">
      {data.map((node, index) => (
        <div key={node.name}>
          {index > 0 && (
            <div className="flex items-center gap-1.5 py-1 pl-7 text-xs font-medium text-[#173EA5]">
              <ChevronDownIcon className="h-4 w-4" />
              {node.minLevel ? `Nível ${node.minLevel}` : 'Evolução'}
            </div>
          )}
          <button
            type="button"
            onClick={() => onSelect(node.name)}
            className="flex w-full items-center gap-3 rounded-full border border-gray-200 p-1.5 pr-4 text-left transition hover:bg-gray-50"
          >
            <div
              className="flex h-[74px] w-24 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: typeColor(node.types[0]) }}
            >
              <img
                src={node.sprite}
                alt={node.name}
                className="h-16 w-16 object-contain [image-rendering:pixelated]"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-black">{formatPokemonName(node.name)}</p>
              <p className="text-xs text-gray-500">{formatId(node.id)}</p>
            </div>
          </button>
        </div>
      ))}
    </div>
  )
}
