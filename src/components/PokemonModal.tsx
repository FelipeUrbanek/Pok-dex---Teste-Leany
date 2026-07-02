import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { usePokemonDetail } from '../hooks/usePokemonDetail'
import { usePokemonWeaknesses } from '../hooks/usePokemonWeaknesses'
import { useFavoritesStore } from '../store/favorites'
import { EvolutionChain } from './EvolutionChain'
import {
  AbilityIcon,
  CategoryIcon,
  FemaleIcon,
  HeartIcon,
  MaleIcon,
  RulerIcon,
  TypeIcon,
  WeightIcon,
} from './icons'
import { typeColor, typeLabel } from '../utils/typeColors'
import { formatPokemonName } from '../utils/formatters'

interface Props {
  name: string
  onClose: () => void
  onSelectPokemon: (name: string) => void
}



export function PokemonModal({ name, onClose, onSelectPokemon }: Props) {
  const { data: pokemon, isLoading } = usePokemonDetail(name)
  const { data: weaknesses } = usePokemonWeaknesses(pokemon?.types ?? [])
  const isFavorite = useFavoritesStore((s) => (pokemon ? s.isFavorite(pokemon.name) : false))
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite)

  const headerColor = pokemon ? typeColor(pokemon.types[0]) : '#173EA5'

  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  
  const [spriteIndex, setSpriteIndex] = useState(0)

  const handleImageClick = () => {
    if (!pokemon || !pokemon.sprites || pokemon.sprites.length <= 1 || !imageRef.current) return
    const nextIndex = (spriteIndex + 1) % pokemon.sprites.length
    
    gsap.to(imageRef.current, {
      rotationY: '+=180',
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete: () => {
        setSpriteIndex(nextIndex)
      }
    })
    // Also we want to swap the image at 90 degrees so it looks natural
    setTimeout(() => {
      setSpriteIndex(nextIndex)
    }, 300)
  }

  useEffect(() => {
    if (!overlayRef.current || !panelRef.current) return
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 })
    gsap.fromTo(
      panelRef.current,
      { opacity: 0, y: 24, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'power2.out' },
    )
  }, [])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        className="no-scrollbar max-h-[90vh] w-full max-w-[360px] overflow-y-auto overflow-x-hidden rounded-[24px] bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {isLoading || !pokemon ? (
          <p className="py-10 text-center text-sm text-gray-400">Carregando...</p>
        ) : (
          <>
            <div
              className="relative flex w-full flex-col items-center"
              style={{ height: '307px' }}
            >
              {/* Ellipse background */}
              <div
                className="absolute"
                style={{
                  width: '498px',
                  height: '498px',
                  left: '-69px',
                  top: '-227px',
                  borderRadius: '50%',
                  background: `linear-gradient(180deg, ${headerColor} 0%, ${headerColor}99 100%)`,
                }}
              />
              
              {/* Watermark */}
              <TypeIcon
                type={pokemon.types[0]}
                color="#FFFFFF"
                className="pointer-events-none absolute h-[204px] w-[204px] opacity-20"
                style={{ left: '77px', top: '35px' }}
              />

              {/* Header icons */}
              <div className="absolute left-[16px] right-[16px] top-[19px] flex items-center justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Fechar"
                  className="flex h-[38px] w-[38px] items-center justify-center text-white transition hover:scale-110"
                >
                  <span className="text-3xl leading-none">×</span>
                </button>
                <button
                  type="button"
                  onClick={() => toggleFavorite(pokemon)}
                  aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                  className="flex h-[28px] w-[28px] items-center justify-center transition hover:scale-110"
                >
                  <HeartIcon filled={isFavorite} outlineColor="#FFFFFF" className="h-[28px] w-[28px] text-white" />
                </button>
              </div>

              {/* Sprite */}
              <div className="absolute z-10 flex cursor-pointer items-center justify-center" style={{ top: '80px', perspective: '1000px' }} onClick={handleImageClick}>
                <img
                  ref={imageRef}
                  src={pokemon.sprites && pokemon.sprites.length > 0 ? pokemon.sprites[spriteIndex] : pokemon.artwork}
                  alt={pokemon.name}
                  className="h-[210px] w-[210px] object-contain drop-shadow-lg [image-rendering:pixelated]"
                />
              </div>
            </div>

            <div className="flex flex-col items-start px-6 pt-4">
              <h2 className="text-3xl font-semibold text-black">
                {formatPokemonName(pokemon.name)}
              </h2>
              <span className="text-sm font-medium text-gray-500">Nº{String(pokemon.id).padStart(3, '0')}</span>
              <div className="mt-3 flex gap-2">
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
                <p className="mt-4 text-left text-sm leading-relaxed text-gray-600">
                  {pokemon.description}
                </p>
              )}

              <div className="mt-6 h-px w-full bg-gray-100" />

              <div className="mt-6 grid w-full grid-cols-2 gap-3">
                <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 py-3">
                  <p className="mb-1 flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-gray-500">
                    <WeightIcon className="h-3.5 w-3.5" /> Peso
                  </p>
                  <p className="text-[15px] font-semibold text-gray-800">{pokemon.weightKg.toString().replace('.', ',')} kg</p>
                </div>
                <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 py-3">
                  <p className="mb-1 flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-gray-500">
                    <RulerIcon className="h-3.5 w-3.5" /> Altura
                  </p>
                  <p className="text-[15px] font-semibold text-gray-800">{pokemon.heightM.toString().replace('.', ',')} m</p>
                </div>
                <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 py-3">
                  <p className="mb-1 flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-gray-500">
                    <CategoryIcon className="h-3.5 w-3.5" /> Categoria
                  </p>
                  <p className="text-[15px] font-semibold text-gray-800">{pokemon.category || '—'}</p>
                </div>
                <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 py-3">
                  <p className="mb-1 flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-gray-500">
                    <AbilityIcon className="h-3.5 w-3.5" /> Habilidade
                  </p>
                  <p className="text-[15px] font-semibold text-gray-800">{pokemon.ability}</p>
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
                <h3 className="mb-2 text-sm font-semibold text-gray-700">Evoluções</h3>
                <EvolutionChain speciesName={pokemon.speciesName} onSelect={onSelectPokemon} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
