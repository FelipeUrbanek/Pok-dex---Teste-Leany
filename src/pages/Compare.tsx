import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useCompareStore } from '../store/compare'
import { usePokemonDetail } from '../hooks/usePokemonDetail'
import { usePokemonNameIndex } from '../hooks/usePokemonNameIndex'
import { formatPokemonName, formatStatName } from '../utils/formatters'
import { typeColor, typeLabel, typeTint } from '../utils/typeColors'
import { CompareIcon, TypeIcon } from '../components/icons'

const MAX_STAT = 180

import { useState } from 'react'

function PokemonPicker({ slot }: { slot: 'A' | 'B' }) {
  const value = useCompareStore((s) => (slot === 'A' ? s.slotA : s.slotB))
  const setSlot = useCompareStore((s) => s.setSlot)
  const { data: names } = usePokemonNameIndex()
  const { data: pokemon } = usePokemonDetail(value)

  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (value && pokemon) {
    return (
      <div className="flex flex-1 items-center justify-between gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2">
        <div className="flex items-center gap-2">
          <img
            src={pokemon.sprite}
            alt={pokemon.name}
            className="h-10 w-10 object-contain [image-rendering:pixelated]"
          />
          <span className="text-sm font-semibold text-gray-800">
            {formatPokemonName(pokemon.name)}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setSlot(slot, null)}
          aria-label="Remover seleção"
          className="text-lg leading-none text-gray-400 transition hover:text-red-500"
        >
          ×
        </button>
      </div>
    )
  }

  const filtered = names
    ?.filter((n) => n.name.includes(search.toLowerCase()))
    .slice(0, 50)

  return (
    <div className="relative flex-1" ref={containerRef}>
      <input
        type="text"
        value={search}
        onFocus={() => setIsOpen(true)}
        onChange={(e) => {
          setSearch(e.target.value)
          setIsOpen(true)
        }}
        placeholder={`Escolher Pokémon ${slot}`}
        className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#173EA5]"
      />
      {isOpen && filtered && filtered.length > 0 && (
        <div className="absolute left-0 right-0 top-[110%] z-50 max-h-60 overflow-y-auto rounded-xl border border-gray-100 bg-white p-2 shadow-xl">
          {filtered.map((n) => {
            const id = n.url.split('/').filter(Boolean).pop()
            return (
              <button
                key={n.name}
                type="button"
                className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition hover:bg-gray-50"
                onClick={() => {
                  setSlot(slot, n.name)
                  setIsOpen(false)
                  setSearch('')
                }}
              >
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                  alt={n.name}
                  className="h-8 w-8 object-contain [image-rendering:pixelated]"
                />
                <span className="text-sm font-medium text-gray-700">{formatPokemonName(n.name)}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function Compare() {
  const slotA = useCompareStore((s) => s.slotA)
  const slotB = useCompareStore((s) => s.slotB)
  const clear = useCompareStore((s) => s.clear)
  const swap = useCompareStore((s) => s.swap)

  const pokemonA = usePokemonDetail(slotA)
  const pokemonB = usePokemonDetail(slotB)

  const ready = pokemonA.data && pokemonB.data
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ready || !containerRef.current) return
    const pokes = containerRef.current.querySelectorAll('[data-poke-anim]')
    gsap.fromTo(
      pokes,
      { opacity: 0, scale: 0, rotation: -15, y: -20 },
      { opacity: 1, scale: 1, rotation: 0, y: 0, duration: 0.7, ease: 'back.out(1.6)', stagger: 0.15 }
    )
    const bars = containerRef.current.querySelectorAll('[data-bar]')
    gsap.fromTo(
      bars,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.5, ease: 'power2.out', stagger: 0.05, delay: 0.3 },
    )
    const rows = containerRef.current.querySelectorAll('[data-row]')
    gsap.fromTo(
      rows,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', stagger: 0.05, delay: 0.3 },
    )
  }, [ready, pokemonA.data, pokemonB.data])

  const totalA = pokemonA.data?.stats.reduce((sum, s) => sum + s.base, 0) ?? 0
  const totalB = pokemonB.data?.stats.reduce((sum, s) => sum + s.base, 0) ?? 0

  let winsA = 0
  let winsB = 0
  if (pokemonA.data && pokemonB.data) {
    pokemonA.data.stats.forEach((statA, index) => {
      const statB = pokemonB.data!.stats[index]
      if (statA.base > statB.base) winsA += 1
      else if (statB.base > statA.base) winsB += 1
    })
  }

  const typeColorA = pokemonA.data ? typeColor(pokemonA.data.types[0]) : '#173EA5'
  const typeColorB = pokemonB.data ? typeColor(pokemonB.data.types[0]) : '#173EA5'
  const tintA = pokemonA.data ? typeTint(pokemonA.data.types[0]) : '#ffffff'
  const tintB = pokemonB.data ? typeTint(pokemonB.data.types[0]) : '#ffffff'

  return (
    <div>
      {/* VS Header Pickers */}
      <div className="mb-6 flex items-center justify-center gap-3">
        <PokemonPicker slot="A" />
        
        <button
          type="button"
          onClick={swap}
          aria-label="Trocar lados"
          disabled={!slotA && !slotB}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 disabled:opacity-40"
        >
          <CompareIcon className="h-4 w-4" />
        </button>
        
        <PokemonPicker slot="B" />
      </div>

      {(slotA || slotB) && (
        <div className="mb-4 text-center">
          <button
            type="button"
            onClick={clear}
            className="rounded-full bg-gray-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-black"
          >
            Limpar seleção
          </button>
        </div>
      )}

      {!ready && (
        <p className="py-10 text-center text-sm text-gray-400">
          Escolha dois Pokémons para comparar as estatísticas.
        </p>
      )}

      {ready && pokemonA.data && pokemonB.data && (
        <div 
          ref={containerRef} 
          className="relative overflow-hidden rounded-[24px] p-6 shadow-2xl border border-white/50"
          style={{ background: `linear-gradient(135deg, ${tintA} 0%, ${tintB} 100%)` }}
        >
          <div className="absolute inset-0 bg-white/75 backdrop-blur-xl" />
          
          <div className="relative z-10">
            <div className="mb-8 flex items-end justify-around">
            {[pokemonA.data, pokemonB.data].map((pokemon, index) => {
              const isWinner =
                (index === 0 && winsA > winsB) || (index === 1 && winsB > winsA)
              return (
                <div key={pokemon.id} data-poke-anim className="relative flex flex-col items-center">
                  <div className="relative flex h-[120px] w-[120px] items-center justify-center">
                    {isWinner && (
                      <span className="absolute -top-2 z-30 rounded-full bg-gradient-to-r from-amber-200 to-yellow-400 px-3 py-1 text-[11px] font-black text-amber-900 shadow-md ring-2 ring-white">
                        🏆 Vencedor
                      </span>
                    )}
                    <div className="absolute inset-0 z-0 opacity-30 flex items-center justify-center pointer-events-none">
                      <TypeIcon type={pokemon.types[0]} className="h-28 w-28" color={typeColor(pokemon.types[0])} />
                    </div>
                    <img
                      src={pokemon.artwork}
                      alt={pokemon.name}
                      className="absolute z-10 max-h-full max-w-full object-contain drop-shadow-xl transition-transform hover:scale-110 hover:-rotate-3 [image-rendering:pixelated]"
                    />
                    <div className="absolute inset-0 z-0 rounded-full bg-white/30 blur-2xl pointer-events-none" />
                  </div>
                  <p className="mt-4 text-xl font-black text-gray-900 capitalize">{formatPokemonName(pokemon.name)}</p>
                  <div className="mt-1 flex gap-1">
                    {pokemon.types.map((type) => (
                      <span
                        key={type}
                        className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                        style={{ backgroundColor: typeColor(type) }}
                      >
                        <TypeIcon type={type} className="h-3 w-3" />
                        {typeLabel(type)}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {winsA !== winsB ? (
            <p className="mb-6 text-center text-sm text-gray-400">
              {formatPokemonName(winsA > winsB ? pokemonA.data.name : pokemonB.data.name)} vence em{' '}
              {Math.max(winsA, winsB)} de {pokemonA.data.stats.length} status
            </p>
          ) : (
            <p className="mb-6 text-center text-sm text-gray-400">Empate nos status base</p>
          )}

          <div className="space-y-4 rounded-xl bg-white/60 p-5 shadow-inner backdrop-blur-md">
            {pokemonA.data.stats.map((statA, index) => {
              const statB = pokemonB.data!.stats[index]
              const higherIsA = statA.base > statB.base
              const higherIsB = statB.base > statA.base
              return (
                <div key={statA.name} data-row>
                  <div className="mb-1.5 flex items-center justify-between text-[11px] uppercase tracking-wider">
                    <span
                      className="font-black"
                      style={{ color: higherIsA ? typeColorA : '#9CA3AF' }}
                    >
                      {statA.base}
                    </span>
                    <span className="font-bold text-gray-500">{formatStatName(statA.name)}</span>
                    <span
                      className="font-black"
                      style={{ color: higherIsB ? typeColorB : '#9CA3AF' }}
                    >
                      {statB.base}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex h-2.5 justify-end overflow-hidden rounded-full bg-gray-200/50 shadow-inner">
                      <div
                        data-bar
                        className="h-full origin-right rounded-full shadow-sm"
                        style={{
                          width: `${Math.min(100, (statA.base / MAX_STAT) * 100)}%`,
                          backgroundColor: higherIsA ? typeColorA : '#D1D5DB',
                        }}
                      />
                    </div>
                    <div className="flex h-2.5 overflow-hidden rounded-full bg-gray-200/50 shadow-inner">
                      <div
                        data-bar
                        className="h-full origin-left rounded-full shadow-sm"
                        style={{
                          width: `${Math.min(100, (statB.base / MAX_STAT) * 100)}%`,
                          backgroundColor: higherIsB ? typeColorB : '#D1D5DB',
                        }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}

            <div data-row className="mt-6 border-t border-gray-200/50 pt-5">
              <div className="flex items-center justify-between text-sm font-black uppercase tracking-wider">
                <span style={{ color: totalA > totalB ? typeColorA : '#9CA3AF' }}>
                  {totalA}
                </span>
                <span className="text-gray-500">Total</span>
                <span style={{ color: totalB > totalA ? typeColorB : '#9CA3AF' }}>
                  {totalB}
                </span>
              </div>
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
