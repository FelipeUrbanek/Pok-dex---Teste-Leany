import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { toast } from 'react-toastify'
import type { PokemonSummary } from '../types/pokemon'
import { formatPokemonName } from '../utils/formatters'

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
        const label = formatPokemonName(pokemon.name)
        
        if (exists) {
          set({ items: items.filter((p) => p.name !== pokemon.name) })
          toast(`💔 ${label} removido dos favoritos`)
        } else {
          set({ items: [...items, pokemon] })
          toast(`❤️ ${label} adicionado aos favoritos`)
        }
      },
    }),
    { name: 'pokedex-favorites' },
  ),
)
