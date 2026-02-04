export function EmptyState() {
  return (
    <div className="bg-white rounded-xl border border-[#EBEBEB] p-12 text-center">
      <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-[#F7F7F7] flex items-center justify-center">
        <svg
          className="w-16 h-16 text-[#EBEBEB]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-[#484848] mb-2">No messages yet</h2>
      <p className="text-[#767676] max-w-md mx-auto">
        When you contact a host or receive a message about a listing, it will appear here.
      </p>
    </div>
  )
}
