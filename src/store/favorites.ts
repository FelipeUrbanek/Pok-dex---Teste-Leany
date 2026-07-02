import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { toast } from 'react-toastify'
import type { PokemonSummary } from '../types/pokemon'
import { formatPokemonName } from '../utils/formatters'

interface FavoritesState {
  favorites: PokemonSummary[]
  toggleFavorite: (pokemon: PokemonSummary) => void
  isFavorite: (name: string) => boolean
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (pokemon) => {
        const exists = get().favorites.some((f) => f.name === pokemon.name)
        set({
          favorites: exists
            ? get().favorites.filter((f) => f.name !== pokemon.name)
            : [...get().favorites, pokemon],
        })
        const label = formatPokemonName(pokemon.name)
        toast(
          exists
            ? `💔 ${label} removido dos favoritos`
            : `❤️ ${label} adicionado aos favoritos`,
        )
      },
      isFavorite: (name) => get().favorites.some((f) => f.name === name),
    }),
    { name: 'pokedex-favorites' },
  ),
)
