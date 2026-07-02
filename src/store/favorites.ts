import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PokemonSummary } from '../types/pokemon'

interface FavoritesState {
  items: PokemonSummary[]
  isFavorite: (name: string) => boolean
  toggleFavorite: (pokemon: PokemonSummary) => void
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      isFavorite: (name) => get().items.some((p) => p.name === name),
      toggleFavorite: (pokemon) => {
        const { items } = get()
        const exists = items.some((p) => p.name === pokemon.name)
        if (exists) {
          set({ items: items.filter((p) => p.name !== pokemon.name) })
        } else {
          set({ items: [...items, pokemon] })
        }
      },
    }),
    { name: 'pokedex-favorites' },
  ),
)
