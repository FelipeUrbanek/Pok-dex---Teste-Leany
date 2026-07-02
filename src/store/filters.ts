import { create } from 'zustand'
import type { PokemonType } from '../types/pokemon'

export type SortOption = 'id-asc' | 'id-desc' | 'name-asc' | 'name-desc'

export interface WeightRange {
  min?: number
  max?: number
}

export interface HeightRange {
  min?: number
  max?: number
}

interface FiltersState {
  search: string
  types: PokemonType[]
  generations: number[]
  weight: WeightRange | null
  height: HeightRange | null
  sortBy: SortOption
  setSearch: (value: string) => void
  setTypes: (value: PokemonType[]) => void
  setGenerations: (value: number[]) => void
  setWeight: (value: WeightRange | null) => void
  setHeight: (value: HeightRange | null) => void
  setSortBy: (value: SortOption) => void
  reset: () => void
}

export const useFiltersStore = create<FiltersState>((set) => ({
  search: '',
  types: [],
  generations: [],
  weight: null,
  height: null,
  sortBy: 'id-asc',
  setSearch: (search) => set({ search }),
  setTypes: (types) => set({ types }),
  setGenerations: (generations) => set({ generations }),
  setWeight: (weight) => set({ weight }),
  setHeight: (height) => set({ height }),
  setSortBy: (sortBy) => set({ sortBy }),
  reset: () =>
    set({
      search: '',
      types: [],
      generations: [],
      weight: null,
      height: null,
      sortBy: 'id-asc',
    }),
}))
