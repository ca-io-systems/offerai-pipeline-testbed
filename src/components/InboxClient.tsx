'use client'

import { useState, useEffect, useCallback } from 'react'
import { ConversationList } from './ConversationList'
import { ConversationThread } from './ConversationThread'
import { EmptyState } from './EmptyState'
import type { Conversation } from '@/actions/messages'
import { getConversations } from '@/actions/messages'

type SelectedConversation = {
  otherUserId: number
  listingId: number
} | null

export function InboxClient({
  initialConversations,
}: {
  initialConversations: Conversation[]
}) {
  const [conversations, setConversations] = useState(initialConversations)
  const [selected, setSelected] = useState<SelectedConversation>(
    initialConversations.length > 0
      ? {
          otherUserId: initialConversations[0].otherUser.id,
          listingId: initialConversations[0].listing.id,
        }
      : null
  )
  const [refreshKey, setRefreshKey] = useState(0)

  const refreshConversations = useCallback(async () => {
    const updated = await getConversations()
    setConversations(updated)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      refreshConversations()
      setRefreshKey((k) => k + 1)
    }, 5000)

    return () => clearInterval(interval)
  }, [refreshConversations])

  const handleSelect = (otherUserId: number, listingId: number) => {
    setSelected({ otherUserId, listingId })
  }

  const handleMessageSent = () => {
    refreshConversations()
    setRefreshKey((k) => k + 1)
  }

  if (conversations.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#484848] mb-6">Messages</h1>
        <EmptyState />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[#484848] mb-6">Messages</h1>
      <div className="bg-white rounded-xl border border-[#EBEBEB] overflow-hidden">
        <div className="flex h-[600px]">
          <div className="w-1/3 border-r border-[#EBEBEB] overflow-y-auto">
            <ConversationList
              conversations={conversations}
              selectedId={selected ? `${Math.min(3, selected.otherUserId)}-${Math.max(3, selected.otherUserId)}-${selected.listingId}` : null}
              onSelect={handleSelect}
            />
          </div>
          <div className="w-2/3 flex flex-col">
            {selected ? (
              <ConversationThread
                key={`${selected.otherUserId}-${selected.listingId}-${refreshKey}`}
                otherUserId={selected.otherUserId}
                listingId={selected.listingId}
                onMessageSent={handleMessageSent}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-[#767676]">
                Select a conversation
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
