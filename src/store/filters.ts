import { create } from 'zustand'
import type { PokemonType } from '../types/pokemon'

export type SortOption = 'id-asc' | 'id-desc' | 'name-asc' | 'name-desc'

interface FiltersState {
  search: string
  type: PokemonType | null
  sortBy: SortOption
  setSearch: (value: string) => void
  setType: (value: PokemonType | null) => void
  setSortBy: (value: SortOption) => void
  reset: () => void
}

export const useFiltersStore = create<FiltersState>((set) => ({
  search: '',
  type: null,
  sortBy: 'id-asc',
  setSearch: (search) => set({ search }),
  setType: (type) => set({ type }),
  setSortBy: (sortBy) => set({ sortBy }),
  reset: () => set({ search: '', type: null, sortBy: 'id-asc' }),
}))
