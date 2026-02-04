'use client'

import { useState } from 'react'

interface DescriptionProps {
  text: string
  maxLength?: number
}

export default function Description({ text, maxLength = 400 }: DescriptionProps) {
  const [expanded, setExpanded] = useState(false)
  const shouldTruncate = text.length > maxLength

  const displayText = expanded || !shouldTruncate ? text : text.slice(0, maxLength) + '...'

  return (
    <div>
      <p className="whitespace-pre-line">{displayText}</p>
      {shouldTruncate && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 font-medium underline"
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  )
}
