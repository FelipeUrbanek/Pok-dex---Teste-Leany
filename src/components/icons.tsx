import {
  ArrowLeftRight,
  ChevronDown,
  ChevronLeft,
  Fish,
  Heart,
  Search,
  Sparkles,
  Tag,
  Weight,
  Ruler,
  Mars,
  Venus,
  Filter,
} from 'lucide-react'
import type { PokemonType } from '../types/pokemon'

interface IconProps {
  className?: string
  style?: React.CSSProperties
}

export function TypeIcon({
  type,
  className,
  style,
  color = '#FFFFFF',
}: IconProps & { type: PokemonType; color?: string }) {
  const maskImage = `url(/icons/types/${type}.svg)`
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
        ...style,
        display: 'inline-block',
        backgroundColor: color,
        WebkitMaskImage: maskImage,
        maskImage,
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }}
    />
  )
}

export function PokeballIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    </svg>
  )
}

export function HeartIcon({
  className,
  filled,
  outlineColor = '#FFFFFF',
}: IconProps & { filled: boolean; outlineColor?: string }) {
  return (
    <Heart
      className={className}
      fill={filled ? '#CD3131' : 'none'}
      stroke={filled ? '#CD3131' : outlineColor}
      strokeWidth={2}
    />
  )
}

export function SearchIcon({ className }: IconProps) {
  return <Search className={className} stroke="#999999" strokeWidth={2} />
}

export function BackArrowIcon({ className }: IconProps) {
  return <ChevronLeft className={className} strokeWidth={2} />
}

export function ChevronDownIcon({ className }: IconProps) {
  return <ChevronDown className={className} strokeWidth={2} />
}

export function EmptyFishIcon({ className }: IconProps) {
  return <Fish className={className} stroke="#C7C9CC" strokeWidth={1.5} />
}

export function CompareIcon({ className }: IconProps) {
  return <ArrowLeftRight className={className} strokeWidth={2} />
}

export function WeightIcon({ className }: IconProps) {
  return <Weight className={className} strokeWidth={2} />
}

export function RulerIcon({ className }: IconProps) {
  return <Ruler className={className} strokeWidth={2} />
}

export function CategoryIcon({ className }: IconProps) {
  return <Tag className={className} strokeWidth={2} />
}

export function AbilityIcon({ className }: IconProps) {
  return <Sparkles className={className} strokeWidth={2} />
}

export function MaleIcon({ className }: IconProps) {
  return <Mars className={className} strokeWidth={2} />
}

export function FemaleIcon({ className }: IconProps) {
  return <Venus className={className} strokeWidth={2} />
}

export function FilterIcon({ className }: IconProps) {
  return <Filter className={className} strokeWidth={2} />
}
