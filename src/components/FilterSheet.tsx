interface Option {
  value: string
  label: string
  color?: string
}

interface Props {
  title: string
  options: Option[]
  selected: string[]
  onToggle: (value: string) => void
  onClose: () => void
}

export function FilterSheet({ title, options, selected, onToggle, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-30 flex items-end justify-center bg-black/40 sm:items-center"
      onClick={onClose}
    >
      <div
        className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-4 pb-6 sm:rounded-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-[3px] w-10 rounded-full bg-gray-200" />
        <h2 className="mb-4 text-center text-base font-semibold text-black">{title}</h2>
        <div className="space-y-3">
          {options.map((option) => {
            const isSelected = selected.includes(option.value)
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onToggle(option.value)}
                className="flex h-[42px] w-full items-center justify-center rounded-full text-sm font-medium text-white transition"
                style={{
                  backgroundColor: option.color ?? '#1A1A1A',
                  outline: isSelected ? '3px solid rgba(23,62,165,0.4)' : 'none',
                  outlineOffset: '1px',
                }}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
