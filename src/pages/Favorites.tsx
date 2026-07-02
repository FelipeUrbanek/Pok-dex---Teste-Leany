import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import gsap from 'gsap'
import { useFavoritesStore } from '../store/favorites'
import { PokemonCard } from '../components/PokemonCard'
import { PokemonModal } from '../components/PokemonModal'
import { EmptyFishIcon } from '../components/icons'

export function Favorites() {
  const favorites = useFavoritesStore((s) => s.favorites)
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedName = searchParams.get('pokemon')
  
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (favorites.length > 0 && containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.05, ease: 'back.out(1.2)', overwrite: 'auto' }
      )
    }
  }, [favorites.length])

  function openPokemon(name: string) {
    setSearchParams((params) => {
      params.set('pokemon', name)
      return params
    })
  }

  function closeModal() {
    setSearchParams((params) => {
      params.delete('pokemon')
      return params
    })
  }

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <EmptyFishIcon className="h-28 w-28" />
        <h1 className="text-lg font-semibold text-gray-700">
          Você não favoritou nenhum Pokémon :(
        </h1>
        <p className="max-w-xs text-sm text-gray-500">
          Clique no ícone de coração dos seus pokémons favoritos e eles aparecerão aqui.
        </p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-4 text-lg font-semibold text-gray-800">
        Seus favoritos ({favorites.length})
      </h1>
      <div ref={containerRef} className="grid grid-cols-1 gap-[12px] sm:grid-cols-2">
        {favorites.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} onSelect={openPokemon} />
        ))}
      </div>

      {selectedName && (
        <PokemonModal name={selectedName} onClose={closeModal} onSelectPokemon={openPokemon} />
      )}
    </div>
  )
}
