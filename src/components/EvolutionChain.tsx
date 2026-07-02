import { useEvolutionChain } from '../hooks/useEvolutionChain'
import { formatPokemonName } from '../utils/formatters'
import { typeColor } from '../utils/typeColors'
import { ChevronDownIcon, TypeIcon } from './icons'

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
    <div className="flex flex-col gap-1">
      {data.map((node, index) => (
        <div key={node.name}>
          {index > 0 && (
            <div className="flex flex-col items-center justify-center py-1 text-xs font-bold text-[#173EA5]">
              <ChevronDownIcon className="h-6 w-6" />
              {node.minLevel ? `Nível ${node.minLevel}` : 'Evolução'}
            </div>
          )}
          <button
            type="button"
            onClick={() => onSelect(node.name)}
            className="flex w-full items-center gap-3 rounded-[90px] border border-gray-200 p-2 pr-4 text-left transition hover:bg-gray-50"
          >
            <div
              className="relative flex h-[74px] w-[96px] shrink-0 items-center justify-center rounded-[71px] overflow-hidden"
              style={{ backgroundColor: typeColor(node.types[0]) }}
            >
              <div className="absolute inset-0 opacity-20 flex items-center justify-center pointer-events-none">
                <TypeIcon type={node.types[0]} className="h-16 w-16" color="#FFFFFF" />
              </div>
              <img
                src={node.sprite}
                alt={node.name}
                className="relative z-10 h-[81px] w-[108px] object-contain drop-shadow-md [image-rendering:pixelated]"
              />
            </div>
            <div className="flex flex-col gap-[2px]">
              <p className="text-[16px] font-medium leading-none text-[#1A1A1A]">
                {formatPokemonName(node.name)}
              </p>
              <p className="text-[12px] font-medium text-[#4D4D4D]">Nº{String(node.id).padStart(3, '0')}</p>
              <div className="mt-1 flex gap-1">
                {node.types.map((type) => (
                  <div
                    key={type}
                    className="flex h-[16px] w-[60px] items-center justify-center rounded-[20px]"
                    style={{ backgroundColor: typeColor(type) }}
                  >
                    <TypeIcon type={type} className="h-[12px] w-[12px] text-white" color="#FFF" />
                  </div>
                ))}
              </div>
            </div>
          </button>
        </div>
      ))}
    </div>
  )
}
