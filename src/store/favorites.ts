import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PokemonSummary } from '../types/pokemon'

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
      },
      isFavorite: (name) => get().favorites.some((f) => f.name === name),
    }),
    { name: 'pokedex-favorites' },
  ),
)
