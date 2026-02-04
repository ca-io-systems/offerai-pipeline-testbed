'use client'

import { useState } from 'react'
import { StarIcon } from './StarIcon'

type StarRatingProps = {
  name: string
  value: number
  onChange: (value: number) => void
  label?: string
}

export function StarRating({ name, value, onChange, label }: StarRatingProps) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-sm text-[#484848] w-32">{label}</span>}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="p-0.5 cursor-pointer"
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(star)}
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            <StarIcon
              filled={star <= (hovered || value)}
              className="w-6 h-6"
            />
          </button>
        ))}
      </div>
      <input type="hidden" name={name} value={value} />
    </div>
  )
}
