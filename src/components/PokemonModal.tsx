import { usePokemonDetail } from '../hooks/usePokemonDetail'
import { usePokemonWeaknesses } from '../hooks/usePokemonWeaknesses'
import { useFavoritesStore } from '../store/favorites'
import { useCompareStore } from '../store/compare'
import { EvolutionChain } from './EvolutionChain'
import {
  AbilityIcon,
  BackArrowIcon,
  CategoryIcon,
  CompareIcon,
  FemaleIcon,
  HeartIcon,
  MaleIcon,
  RulerIcon,
  TypeIcon,
  WeightIcon,
} from './icons'
import { typeColor, typeLabel } from '../utils/typeColors'
import { formatId, formatPokemonName, formatStatName } from '../utils/formatters'

interface Props {
  name: string
  onClose: () => void
  onSelectPokemon: (name: string) => void
}

const MAX_STAT = 180

export function PokemonModal({ name, onClose, onSelectPokemon }: Props) {
  const { data: pokemon, isLoading } = usePokemonDetail(name)
  const { data: weaknesses } = usePokemonWeaknesses(pokemon?.types ?? [])
  const isFavorite = useFavoritesStore((s) => (pokemon ? s.isFavorite(pokemon.name) : false))
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite)
  const isCompareSelected = useCompareStore((s) => s.isSelected(name))
  const toggleCompare = useCompareStore((s) => s.toggleFromCard)

  const headerColor = pokemon ? typeColor(pokemon.types[0]) : '#173EA5'

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white"
        onClick={(event) => event.stopPropagation()}
      >
        {isLoading || !pokemon ? (
          <p className="py-10 text-center text-sm text-gray-400">Carregando...</p>
        ) : (
          <>
            <div
              className="relative flex flex-col items-center overflow-hidden pb-4 pt-5"
              style={{
                background: `linear-gradient(180deg, ${headerColor}99 0%, ${headerColor}26 100%)`,
              }}
            >
              <div className="flex w-full items-center justify-between px-4">
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Fechar"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700"
                >
                  <BackArrowIcon className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleCompare(pokemon.name)}
                    aria-label={isCompareSelected ? 'Remover da comparação' : 'Adicionar à comparação'}
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      isCompareSelected ? 'bg-[#173EA5] text-white' : 'bg-white text-gray-500'
                    }`}
                  >
                    <CompareIcon className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleFavorite(pokemon)}
                    aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white"
                  >
                    <HeartIcon filled={isFavorite} outlineColor="#999999" className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <TypeIcon
                type={pokemon.types[0]}
                color="#FFFFFF"
                className="pointer-events-none absolute left-1/2 top-2 h-48 w-48 -translate-x-1/2 opacity-40"
              />
              <img
                src={pokemon.artwork}
                alt={pokemon.name}
                className="relative z-[1] mt-2 h-36 w-36 object-contain [image-rendering:pixelated]"
              />
            </div>

            <div className="flex flex-col items-center px-6 pt-4">
              <h2 className="text-2xl font-semibold text-black">
                {formatPokemonName(pokemon.name)}
              </h2>
              <span className="text-xs text-gray-500">{formatId(pokemon.id)}</span>
              <div className="mt-2 flex gap-1.5">
                {pokemon.types.map((type) => (
                  <span
                    key={type}
                    className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-white"
                    style={{ backgroundColor: typeColor(type) }}
                  >
                    <TypeIcon type={type} className="h-3.5 w-3.5" />
                    {typeLabel(type)}
                  </span>
                ))}
              </div>

              {pokemon.description && (
                <p className="mt-3 text-center text-sm leading-relaxed text-gray-600">
                  {pokemon.description}
                </p>
              )}

              <div className="mt-5 h-px w-full bg-gray-100" />

              <div className="mt-5 grid w-full grid-cols-2 gap-3">
                <div className="rounded-2xl border border-gray-200 p-3">
                  <p className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-gray-500">
                    <WeightIcon className="h-3.5 w-3.5" /> Peso
                  </p>
                  <p className="text-base font-semibold text-gray-900">{pokemon.weightKg} kg</p>
                </div>
                <div className="rounded-2xl border border-gray-200 p-3">
                  <p className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-gray-500">
                    <RulerIcon className="h-3.5 w-3.5" /> Altura
                  </p>
                  <p className="text-base font-semibold text-gray-900">{pokemon.heightM} m</p>
                </div>
                <div className="rounded-2xl border border-gray-200 p-3">
                  <p className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-gray-500">
                    <CategoryIcon className="h-3.5 w-3.5" /> Categoria
                  </p>
                  <p className="text-base font-semibold text-gray-900">{pokemon.category || '—'}</p>
                </div>
                <div className="rounded-2xl border border-gray-200 p-3">
                  <p className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-gray-500">
                    <AbilityIcon className="h-3.5 w-3.5" /> Habilidade
                  </p>
                  <p className="text-base font-semibold text-gray-900">{pokemon.ability}</p>
                </div>
              </div>

              {pokemon.femaleRate !== null && (
                <div className="mt-5 w-full">
                  <p className="mb-1.5 text-center text-[10px] font-medium uppercase tracking-wide text-gray-500">
                    Gênero
                  </p>
                  <div className="flex h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full bg-[#2551C3]"
                      style={{ width: `${(1 - pokemon.femaleRate) * 100}%` }}
                    />
                    <div
                      className="h-full bg-[#FF7596]"
                      style={{ width: `${pokemon.femaleRate * 100}%` }}
                    />
                  </div>
                  <div className="mt-1.5 flex justify-between text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <MaleIcon className="h-3.5 w-3.5 text-[#2551C3]" />
                      {(100 - pokemon.femaleRate * 100).toFixed(1)}%
                    </span>
                    <span className="flex items-center gap-1">
                      <FemaleIcon className="h-3.5 w-3.5 text-[#FF7596]" />
                      {(pokemon.femaleRate * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 pb-6">
              {weaknesses && weaknesses.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-2 text-sm font-semibold text-gray-700">Fraquezas</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {weaknesses.map((type) => (
                      <span
                        key={type}
                        className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-white"
                        style={{ backgroundColor: typeColor(type) }}
                      >
                        <TypeIcon type={type} className="h-3.5 w-3.5" />
                        {typeLabel(type)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <h3 className="mb-2 text-sm font-semibold text-gray-700">Status base</h3>
                <div className="space-y-2">
                  {pokemon.stats.map((stat) => (
                    <div key={stat.name} className="flex items-center gap-2 text-xs">
                      <span className="w-20 shrink-0 text-gray-500">
                        {formatStatName(stat.name)}
                      </span>
                      <span className="w-8 shrink-0 text-right font-medium text-gray-700">
                        {stat.base}
                      </span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-[#173EA5]"
                          style={{ width: `${Math.min(100, (stat.base / MAX_STAT) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="mb-2 text-sm font-semibold text-gray-700">Evolução</h3>
                <EvolutionChain speciesName={pokemon.speciesName} onSelect={onSelectPokemon} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
