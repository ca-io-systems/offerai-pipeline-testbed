'use client'

interface GuestSelectorProps {
  value: number
  onChange: (value: number) => void
}

export function GuestSelector({ value, onChange }: GuestSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#767676] mb-1">Guests</label>
      <div className="flex items-center border border-[#EBEBEB] rounded-lg">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, value - 1))}
          disabled={value <= 1}
          className="px-4 py-2 text-[#FF5A5F] hover:bg-[#F7F7F7] disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg"
        >
          −
        </button>
        <span className="flex-1 text-center py-2">
          {value} {value === 1 ? 'guest' : 'guests'}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(16, value + 1))}
          disabled={value >= 16}
          className="px-4 py-2 text-[#FF5A5F] hover:bg-[#F7F7F7] disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg"
        >
          +
        </button>
      </div>
    </div>
  )
}
