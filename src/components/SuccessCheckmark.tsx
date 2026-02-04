'use client'

export function SuccessCheckmark() {
  return (
    <div className="flex justify-center mb-6">
      <div className="animate-checkmark w-20 h-20 rounded-full bg-[#008A05] flex items-center justify-center">
        <svg
          className="w-10 h-10 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            className="animate-checkmark-path"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
    </div>
  )
}
