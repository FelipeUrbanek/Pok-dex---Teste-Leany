interface Props {
  onClick: () => void
  loading: boolean
  disabled?: boolean
}

export function LoadMoreButton({ onClick, loading, disabled }: Props) {
  if (disabled) return null

  return (
    <div className="mt-8 flex justify-center">
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="rounded-full bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-black disabled:opacity-60"
      >
        {loading ? 'Carregando...' : 'Carregar mais'}
      </button>
    </div>
  )
}
