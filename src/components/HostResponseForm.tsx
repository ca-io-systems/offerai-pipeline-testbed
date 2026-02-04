'use client'

import { useState } from 'react'
import { submitHostResponse } from '@/actions/reviews'

type HostResponseFormProps = {
  reviewId: number
  hostId: number
  onCancel: () => void
  onSubmitted: (responseText: string) => void
}

export function HostResponseForm({ reviewId, hostId, onCancel, onSubmitted }: HostResponseFormProps) {
  const [responseText, setResponseText] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append('reviewId', String(reviewId))
    formData.append('hostId', String(hostId))
    formData.append('responseText', responseText)

    const result = await submitHostResponse(formData)

    if (result.error) {
      setError(result.error)
      setIsSubmitting(false)
    } else {
      onSubmitted(responseText)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 ml-6 pl-4 border-l-2 border-[#EBEBEB]">
      {error && (
        <p className="text-sm text-[#C13515] mb-2">{error}</p>
      )}
      <textarea
        value={responseText}
        onChange={(e) => setResponseText(e.target.value)}
        placeholder="Write your response..."
        className="w-full border border-[#EBEBEB] rounded-lg p-3 min-h-[80px] text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
      />
      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          disabled={isSubmitting || !responseText.trim()}
          className="px-4 py-2 bg-[#FF5A5F] text-white text-sm font-medium rounded-lg hover:bg-[#E74E53] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Response'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-[#EBEBEB] text-[#484848] text-sm font-medium rounded-lg hover:bg-[#F7F7F7]"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
