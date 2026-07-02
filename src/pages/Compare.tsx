import { useCompareStore } from '../store/compare'
import { usePokemonDetail } from '../hooks/usePokemonDetail'
import { usePokemonNameIndex } from '../hooks/usePokemonNameIndex'
import { formatPokemonName, formatStatName } from '../utils/formatters'
import { typeColor, typeLabel } from '../utils/typeColors'

function PokemonPicker({ slot }: { slot: 'A' | 'B' }) {
  const value = useCompareStore((s) => (slot === 'A' ? s.slotA : s.slotB))
  const setSlot = useCompareStore((s) => s.setSlot)
  const { data: names } = usePokemonNameIndex()

  return (
    <div className="flex-1">
      <input
        list={`pokemon-options-${slot}`}
        value={value ?? ''}
        onChange={(event) => setSlot(slot, event.target.value || null)}
        placeholder={`Pokémon ${slot}`}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-400"
      />
      <datalist id={`pokemon-options-${slot}`}>
        {names?.map((n) => (
          <option key={n.name} value={n.name} />
        ))}
      </datalist>
    </div>
  )
}

export function Compare() {
  const slotA = useCompareStore((s) => s.slotA)
  const slotB = useCompareStore((s) => s.slotB)
  const clear = useCompareStore((s) => s.clear)

  const pokemonA = usePokemonDetail(slotA)
  const pokemonB = usePokemonDetail(slotB)

  const ready = pokemonA.data && pokemonB.data

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <PokemonPicker slot="A" />
        <span className="font-semibold text-gray-400">vs</span>
        <PokemonPicker slot="B" />
        {(slotA || slotB) && (
          <button
            type="button"
            onClick={clear}
            className="whitespace-nowrap text-sm text-gray-500 underline"
          >
            limpar
          </button>
        )}
      </div>

      {!ready && (
        <p className="py-10 text-center text-sm text-gray-400">
          Escolha dois Pokémons para comparar as estatísticas.
        </p>
      )}

      {ready && pokemonA.data && pokemonB.data && (
        <div className="rounded-2xl bg-white p-6">
          <div className="mb-6 flex items-center justify-around">
            {[pokemonA.data, pokemonB.data].map((pokemon) => (
              <div key={pokemon.id} className="flex flex-col items-center">
                <img src={pokemon.artwork} alt={pokemon.name} className="h-28 w-28 object-contain" />
                <p className="font-semibold text-gray-900">{formatPokemonName(pokemon.name)}</p>
                <div className="mt-1 flex gap-1">
                  {pokemon.types.map((type) => (
                    <span
                      key={type}
                      className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
                      style={{ backgroundColor: typeColor(type) }}
                    >
                      {typeLabel(type)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {pokemonA.data.stats.map((statA, index) => {
              const statB = pokemonB.data!.stats[index]
              const higherIsA = statA.base >= statB.base
              return (
                <div key={statA.name} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <span
                    className={`text-right text-sm font-medium ${
                      higherIsA ? 'text-indigo-600' : 'text-gray-500'
                    }`}
                  >
                    {statA.base}
                  </span>
                  <span className="w-28 text-center text-xs text-gray-400">
                    {formatStatName(statA.name)}
                  </span>
                  <span
                    className={`text-left text-sm font-medium ${
                      !higherIsA ? 'text-indigo-600' : 'text-gray-500'
                    }`}
                  >
                    {statB.base}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
