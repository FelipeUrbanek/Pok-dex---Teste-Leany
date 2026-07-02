import type { PokemonSummary } from '../types/pokemon'
import { typeColor, typeLabel, typeTint } from '../utils/typeColors'
import { formatId, formatPokemonName } from '../utils/formatters'
import { useFavoritesStore } from '../store/favorites'
import { useCompareStore } from '../store/compare'
import { CompareIcon, HeartIcon } from './icons'

interface Props {
  pokemon: PokemonSummary
  onSelect: (name: string) => void
}

export function PokemonCard({ pokemon, onSelect }: Props) {
  const isFavorite = useFavoritesStore((s) => s.isFavorite(pokemon.name))
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite)
  const isCompareSelected = useCompareStore((s) => s.isSelected(pokemon.name))
  const toggleCompare = useCompareStore((s) => s.toggleFromCard)

  const mainType = pokemon.types[0]
  const bg = typeTint(mainType)
  const accent = typeColor(mainType)

  return (
    <div
      onClick={() => onSelect(pokemon.name)}
      className="flex cursor-pointer items-center gap-3 rounded-2xl p-3 transition hover:brightness-[0.98]"
      style={{ backgroundColor: bg }}
    >
      <div className="min-w-0 flex-1">
        <span className="text-xs font-semibold text-gray-600">{formatId(pokemon.id)}</span>
        <h3 className="truncate text-lg font-semibold text-black">
          {formatPokemonName(pokemon.name)}
        </h3>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {pokemon.types.map((type) => (
            <span
              key={type}
              className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium text-white"
              style={{ backgroundColor: typeColor(type) }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
              {typeLabel(type)}
            </span>
          ))}
        </div>
      </div>

      <div
        className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl"
        style={{ backgroundColor: accent }}
      >
        <img
          src={pokemon.sprite}
          alt={pokemon.name}
          loading="lazy"
          className="h-16 w-16 object-contain drop-shadow-md"
        />
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            toggleFavorite(pokemon)
          }}
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow"
        >
          <HeartIcon filled={isFavorite} outlineColor="#999999" className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            toggleCompare(pokemon.name)
          }}
          aria-label={isCompareSelected ? 'Remover da comparação' : 'Adicionar à comparação'}
          className={`absolute -bottom-2 -left-2 flex h-7 w-7 items-center justify-center rounded-full shadow ${
            isCompareSelected ? 'bg-[#173EA5] text-white' : 'bg-white text-gray-500'
          }`}
        >
          <CompareIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
