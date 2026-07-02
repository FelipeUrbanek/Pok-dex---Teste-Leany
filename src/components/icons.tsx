import type { PokemonType } from '../types/pokemon'

interface IconProps {
  className?: string
}

export function TypeIcon({
  type,
  className,
  color = '#FFFFFF',
}: IconProps & { type: PokemonType; color?: string }) {
  const maskImage = `url(/icons/types/${type}.svg)`
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
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

export function HeartIcon({
  className,
  filled,
  outlineColor = '#FFFFFF',
}: IconProps & { filled: boolean; outlineColor?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? '#CD3131' : 'none'}
      stroke={filled ? '#CD3131' : outlineColor}
      strokeWidth="2"
    >
      <path d="M12 21s-7.5-4.6-10-9.3C.5 8.1 2.4 4.5 6 4c2.1-.3 4 .8 6 3 2-2.2 3.9-3.3 6-3 3.6.5 5.5 4.1 4 7.7C19.5 16.4 12 21 12 21z" />
    </svg>
  )
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="#999999" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export function CompareIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 20V9" />
      <path d="M4.5 12.5 8 9l3.5 3.5" />
      <path d="M16 4v11" />
      <path d="M12.5 11.5 16 15l3.5-3.5" />
    </svg>
  )
}
