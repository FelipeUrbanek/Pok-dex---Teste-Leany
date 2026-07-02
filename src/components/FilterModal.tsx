import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useFiltersStore } from '../store/filters'
import type { PokemonType } from '../types/pokemon'
import { typeLabel, typeColor } from '../utils/typeColors'
import { TypeIcon } from './icons'

const POKEMON_TYPES: PokemonType[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
]

const GENERATIONS = [
  { id: 1, label: 'I' },
  { id: 2, label: 'II' },
  { id: 3, label: 'III' },
  { id: 4, label: 'IV' },
  { id: 5, label: 'V' },
  { id: 6, label: 'VI' },
  { id: 7, label: 'VII' },
  { id: 8, label: 'VIII' },
  { id: 9, label: 'IX' },
]

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
}

export function FilterModal({ isOpen, onClose }: FilterModalProps) {
  const store = useFiltersStore()
  
  // Local state for the modal, only applied when clicking "Aplicar"
  const [types, setTypes] = useState<PokemonType[]>(store.types)
  const [generations, setGenerations] = useState<number[]>(store.generations)
  
  // Weights (light < 450, normal 450-2000, heavy > 2000) (represented in hectograms by PokeAPI!)
  // PokeAPI weight: 1 = 0.1kg. So 45kg = 450. 200kg = 2000.
  const [weightFilter, setWeightFilter] = useState<'all' | 'light' | 'normal' | 'heavy'>(
    !store.weight ? 'all' :
    store.weight.max === 450 ? 'light' :
    store.weight.min === 2000 ? 'heavy' : 'normal'
  )
  
  // Heights (small < 10, medium 10-20, tall > 20) (represented in decimeters by PokeAPI!)
  // PokeAPI height: 1 = 0.1m. So 1m = 10. 2m = 20.
  const [heightFilter, setHeightFilter] = useState<'all' | 'small' | 'medium' | 'tall'>(
    !store.height ? 'all' :
    store.height.max === 10 ? 'small' :
    store.height.min === 20 ? 'tall' : 'medium'
  )

  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTypes(store.types)
      setGenerations(store.generations)
      setWeightFilter(
        !store.weight ? 'all' :
        store.weight.max === 450 ? 'light' :
        store.weight.min === 2000 ? 'heavy' : 'normal'
      )
      setHeightFilter(
        !store.height ? 'all' :
        store.height.max === 10 ? 'small' :
        store.height.min === 20 ? 'tall' : 'medium'
      )
      
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 })
      gsap.fromTo(
        panelRef.current,
        { y: '100%' },
        { y: '0%', duration: 0.4, ease: 'power3.out' }
      )
    }
  }, [isOpen, store])

  const handleClose = () => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 })
    gsap.to(panelRef.current, { 
      y: '100%', 
      duration: 0.3, 
      ease: 'power3.in',
      onComplete: onClose
    })
  }

  const handleApply = () => {
    store.setTypes(types)
    store.setGenerations(generations)
    
    if (weightFilter === 'all') store.setWeight(null)
    else if (weightFilter === 'light') store.setWeight({ max: 450 })
    else if (weightFilter === 'normal') store.setWeight({ min: 450, max: 2000 })
    else if (weightFilter === 'heavy') store.setWeight({ min: 2000 })
    
    if (heightFilter === 'all') store.setHeight(null)
    else if (heightFilter === 'small') store.setHeight({ max: 10 })
    else if (heightFilter === 'medium') store.setHeight({ min: 10, max: 20 })
    else if (heightFilter === 'tall') store.setHeight({ min: 20 })

    handleClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Panel */}
      <div 
        ref={panelRef}
        className="relative flex w-full max-w-[500px] flex-col rounded-t-[32px] bg-white p-6 shadow-2xl sm:rounded-[32px] max-h-[90vh] overflow-hidden"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-black text-gray-900">Filtros</h2>
          <button 
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 no-scrollbar">
          {/* Tipos */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-bold text-gray-800">Tipos</h3>
            <div className="flex flex-wrap gap-2">
              {POKEMON_TYPES.map(t => {
                const isSelected = types.includes(t)
                return (
                  <button
                    key={t}
                    onClick={() => setTypes(prev => isSelected ? prev.filter(x => x !== t) : [...prev, t])}
                    className="flex h-10 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-all shadow-sm"
                    style={{ 
                      backgroundColor: isSelected ? typeColor(t) : '#F3F4F6',
                      color: isSelected ? '#FFFFFF' : '#4B5563',
                      border: isSelected ? 'none' : '1px solid #E5E7EB'
                    }}
                  >
                    <TypeIcon type={t} className="h-4 w-4" color={isSelected ? '#FFF' : '#9CA3AF'} />
                    {typeLabel(t)}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Geração */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-bold text-gray-800">Geração</h3>
            <div className="grid grid-cols-5 gap-2">
              {GENERATIONS.map(g => {
                const isSelected = generations.includes(g.id)
                return (
                  <button
                    key={g.id}
                    onClick={() => setGenerations(prev => isSelected ? prev.filter(x => x !== g.id) : [...prev, g.id])}
                    className={`h-10 rounded-xl text-sm font-bold transition-all shadow-sm border ${
                      isSelected 
                        ? 'bg-gray-900 text-white border-gray-900 shadow-md scale-[1.02]' 
                        : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    {g.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Peso e Altura */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div>
              <h3 className="mb-3 text-sm font-bold text-gray-800">Peso</h3>
              <div className="flex flex-col gap-2">
                {[
                  { id: 'all', label: 'Todos' },
                  { id: 'light', label: 'Leve (< 45kg)' },
                  { id: 'normal', label: 'Médio (45-200kg)' },
                  { id: 'heavy', label: 'Pesado (> 200kg)' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setWeightFilter(opt.id as any)}
                    className={`rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition-all shadow-sm border ${
                      weightFilter === opt.id 
                        ? 'bg-gray-900 text-white border-gray-900 shadow-md scale-[1.02]' 
                        : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-bold text-gray-800">Altura</h3>
              <div className="flex flex-col gap-2">
                {[
                  { id: 'all', label: 'Todos' },
                  { id: 'small', label: 'Baixo (< 1m)' },
                  { id: 'medium', label: 'Médio (1-2m)' },
                  { id: 'tall', label: 'Alto (> 2m)' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setHeightFilter(opt.id as any)}
                    className={`rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition-all shadow-sm border ${
                      heightFilter === opt.id 
                        ? 'bg-gray-900 text-white border-gray-900 shadow-md scale-[1.02]' 
                        : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-4 flex gap-3 border-t border-gray-100 pt-5 pb-2">
          <button
            onClick={() => {
              setTypes([])
              setGenerations([])
              setWeightFilter('all')
              setHeightFilter('all')
            }}
            className="flex-1 rounded-2xl bg-white border border-gray-200 py-3.5 font-bold text-gray-600 transition-all hover:bg-gray-50 hover:border-gray-300"
          >
            Limpar
          </button>
          <button
            onClick={handleApply}
            className="flex-1 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 py-3.5 font-bold text-white shadow-xl shadow-gray-900/20 transition-all hover:scale-[1.02] hover:shadow-gray-900/30"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  )
}
