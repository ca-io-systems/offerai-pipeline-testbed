'use client'

import Image from 'next/image'
import type { Conversation } from '@/actions/messages'

function formatTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  } else if (diffDays === 1) {
    return 'Yesterday'
  } else if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: 'short' })
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
}: {
  conversations: Conversation[]
  selectedId: string | null
  onSelect: (otherUserId: number, listingId: number) => void
}) {
  return (
    <div>
      {conversations.map((conv) => (
        <button
          key={conv.id}
          onClick={() => onSelect(conv.otherUser.id, conv.listing.id)}
          className={`w-full p-4 text-left border-b border-[#EBEBEB] hover:bg-[#F7F7F7] transition-colors ${
            selectedId === conv.id ? 'bg-[#F7F7F7]' : ''
          }`}
        >
          <div className="flex gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-[#EBEBEB]">
                {conv.otherUser.avatar ? (
                  <Image
                    src={conv.otherUser.avatar}
                    alt={conv.otherUser.name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#767676] text-lg font-semibold">
                    {conv.otherUser.name[0]}
                  </div>
                )}
              </div>
              {conv.hasUnread && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FF5A5F] rounded-full" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className={`font-semibold text-[#484848] ${conv.hasUnread ? 'text-[#484848]' : ''}`}>
                  {conv.otherUser.name}
                </span>
                <span className="text-xs text-[#767676]">
                  {formatTime(conv.lastMessage.createdAt)}
                </span>
              </div>
              <p className="text-sm text-[#767676] truncate">
                {conv.lastMessage.isFromMe ? 'You: ' : ''}
                {truncate(conv.lastMessage.content, 40)}
              </p>
              <p className="text-xs text-[#767676] truncate mt-1">
                {conv.listing.title}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
