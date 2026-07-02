import { SearchIcon } from './icons'

interface Props {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: Props) {
  return (
    <div className="flex h-12 items-center gap-2 rounded-[30px] border-[1.5px] border-gray-300 bg-white px-4">
      <SearchIcon className="h-5 w-5 shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Procurar Pokémon..."
        className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
      />
    </div>
  )
}
