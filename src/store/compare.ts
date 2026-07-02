import { create } from 'zustand'

interface CompareState {
  slotA: string | null
  slotB: string | null
  setSlot: (slot: 'A' | 'B', name: string | null) => void
  toggleFromCard: (name: string) => void
  isSelected: (name: string) => boolean
  clear: () => void
}

export const useCompareStore = create<CompareState>((set, get) => ({
  slotA: null,
  slotB: null,
  setSlot: (slot, name) => set(slot === 'A' ? { slotA: name } : { slotB: name }),
  toggleFromCard: (name) => {
    const { slotA, slotB } = get()
    if (slotA === name) {
      set({ slotA: null })
      return
    }
    if (slotB === name) {
      set({ slotB: null })
      return
    }
    if (!slotA) {
      set({ slotA: name })
      return
    }
    if (!slotB) {
      set({ slotB: name })
      return
    }
    set({ slotB: name })
  },
  isSelected: (name) => get().slotA === name || get().slotB === name,
  clear: () => set({ slotA: null, slotB: null }),
}))
