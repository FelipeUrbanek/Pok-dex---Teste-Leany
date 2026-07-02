import { create } from 'zustand'
import { toast } from 'react-toastify'
import { formatPokemonName } from '../utils/formatters'

interface CompareState {
  slotA: string | null
  slotB: string | null
  setSlot: (slot: 'A' | 'B', name: string | null) => void
  toggleFromCard: (name: string) => void
  swap: () => void
  isSelected: (name: string) => boolean
  clear: () => void
}

export const useCompareStore = create<CompareState>((set, get) => ({
  slotA: null,
  slotB: null,
  setSlot: (slot, name) => set(slot === 'A' ? { slotA: name } : { slotB: name }),
  toggleFromCard: (name) => {
    const { slotA, slotB } = get()
    const label = formatPokemonName(name)

    if (slotA === name) {
      set({ slotA: null })
      toast(`🔁 ${label} removido da comparação`)
      return
    }
    if (slotB === name) {
      set({ slotB: null })
      toast(`🔁 ${label} removido da comparação`)
      return
    }
    if (!slotA) {
      set({ slotA: name })
      toast(`⚔️ ${label} selecionado para comparar`)
      return
    }
    if (!slotB) {
      set({ slotB: name })
      toast(`⚔️ ${label} selecionado para comparar`)
      return
    }
    set({ slotB: name })
    toast(`⚔️ ${label} substituiu a segunda seleção`)
  },
  swap: () => set((state) => ({ slotA: state.slotB, slotB: state.slotA })),
  isSelected: (name) => get().slotA === name || get().slotB === name,
  clear: () => set({ slotA: null, slotB: null }),
}))
