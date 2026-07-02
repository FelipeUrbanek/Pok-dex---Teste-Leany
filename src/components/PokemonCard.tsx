import type { PokemonSummary } from '../types/pokemon'
import { typeColor, typeLabel, typeTint } from '../utils/typeColors'
import { useRef } from 'react'
import gsap from 'gsap'
import { useFavoritesStore } from '../store/favorites'
import { useCompareStore } from '../store/compare'
import { CompareIcon, HeartIcon, TypeIcon } from './icons'
import { useNavigate } from 'react-router-dom'
import { formatPokemonName } from '../utils/formatters'

interface Props {
  pokemon: PokemonSummary
  onSelect: (name: string) => void
}

export function PokemonCard({ pokemon, onSelect }: Props) {
  const imageRef = useRef<HTMLImageElement>(null)
  const navigate = useNavigate()
  
  const isFavorite = useFavoritesStore((s) => s.isFavorite(pokemon.name))
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite)
  const isCompareSelected = useCompareStore((s) => s.isSelected(pokemon.name))
  const toggleCompare = useCompareStore((s) => s.toggleFromCard)

  const mainType = pokemon.types[0]
  const bg = typeTint(mainType)
  const accent = typeColor(mainType)

  const handleMouseEnter = () => {
    if (!imageRef.current) return
    gsap.killTweensOf(imageRef.current)
    gsap.to(imageRef.current, {
      y: -8,
      rotation: 5,
      duration: 0.3,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1
    })
  }

  const handleMouseLeave = () => {
    if (!imageRef.current) return
    gsap.killTweensOf(imageRef.current)
    gsap.to(imageRef.current, {
      y: 0,
      rotation: 0,
      duration: 0.3,
      ease: 'bounce.out'
    })
  }

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative flex h-[116px] w-full cursor-pointer overflow-hidden rounded-[20px] transition-all duration-300 ${
        isCompareSelected ? 'ring-4 ring-offset-2 ring-offset-white ring-[#173EA5] scale-[1.02] shadow-xl' : 'hover:-translate-y-1 hover:shadow-lg'
      }`}
      style={{ backgroundColor: bg }}
    >
      {/* Left side (Info) */}
      <div 
        className="flex flex-1 flex-col justify-center py-4 pl-4 pr-2"
        onClick={() => onSelect(pokemon.name)}
      >
        <span className="text-xs font-black text-gray-700 opacity-60">
          Nº{String(pokemon.id).padStart(3, '0')}
        </span>
        <h3 className="text-xl font-black text-gray-900 capitalize leading-tight mb-2">
          {formatPokemonName(pokemon.name)}
        </h3>
        <div className="flex gap-1.5">
          {pokemon.types.map((type) => (
            <span
              key={type}
              className="flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm"
              style={{ backgroundColor: typeColor(type) }}
            >
              <TypeIcon type={type} className="h-3.5 w-3.5" />
              <span className="pr-1">{typeLabel(type)}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Right side (Image & Actions) */}
      <div className="relative flex w-[130px] shrink-0 items-center justify-center" style={{ backgroundColor: accent, perspective: '1000px' }}>
        {/* Background type watermark */}
        <div className="absolute inset-0 opacity-20 flex items-center justify-center pointer-events-none overflow-hidden">
          <TypeIcon type={mainType} className="h-28 w-28" color="#FFFFFF" />
        </div>

        <img
          ref={imageRef}
          src={pokemon.sprite}
          alt={pokemon.name}
          onClick={() => onSelect(pokemon.name)}
          className="relative z-10 h-20 w-20 object-contain drop-shadow-lg [image-rendering:pixelated]"
        />

        {/* Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            toggleFavorite(pokemon)
          }}
          className="absolute right-2 top-2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition hover:bg-white/40"
        >
          <HeartIcon filled={isFavorite} outlineColor="#FFFFFF" className="h-4 w-4 text-white" />
        </button>

        {/* Compare Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            toggleCompare(pokemon.name)
            const { slotA, slotB } = useCompareStore.getState()
            if (slotA && slotB && (slotA === pokemon.name || slotB === pokemon.name)) {
              navigate('/comparar')
            }
          }}
          className={`absolute bottom-2 right-2 z-20 flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-sm transition ${
            isCompareSelected ? 'bg-white shadow-md' : 'bg-white/20 hover:bg-white/40'
          }`}
        >
          <CompareIcon className={`h-4 w-4 ${isCompareSelected ? 'text-[#173EA5]' : 'text-white'}`} />
        </button>
      </div>
    </div>
  )
}
