'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { getConversationMessages, markAsRead, type ConversationDetails } from '@/actions/messages'
import { MessageInput } from './MessageInput'

function formatDate(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return 'Today'
  } else if (diffDays === 1) {
    return 'Yesterday'
  } else {
    return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })
  }
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

function formatBookingDates(checkIn: Date, checkOut: Date): string {
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
  return `${checkIn.toLocaleDateString([], options)} - ${checkOut.toLocaleDateString([], options)}`
}

function shouldShowTimestamp(current: Date, previous: Date | null): boolean {
  if (!previous) return true
  const diffMs = current.getTime() - previous.getTime()
  const diffMinutes = diffMs / (1000 * 60)
  return diffMinutes > 60 || current.toDateString() !== previous.toDateString()
}

export function ConversationThread({
  otherUserId,
  listingId,
  onMessageSent,
}: {
  otherUserId: number
  listingId: number
  onMessageSent: () => void
}) {
  const [details, setDetails] = useState<ConversationDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const data = await getConversationMessages(otherUserId, listingId)
      setDetails(data)
      setLoading(false)

      if (data) {
        await markAsRead(otherUserId, listingId)
      }
    }
    load()
  }, [otherUserId, listingId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [details?.messages])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-[#767676]">
        Loading...
      </div>
    )
  }

  if (!details) {
    return (
      <div className="flex-1 flex items-center justify-center text-[#767676]">
        Conversation not found
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="p-4 border-b border-[#EBEBEB] bg-[#F7F7F7]">
        <div className="flex items-center gap-3">
          <div className="w-16 h-12 rounded-lg overflow-hidden bg-[#EBEBEB] flex-shrink-0">
            <Image
              src={details.listing.image}
              alt={details.listing.title}
              width={64}
              height={48}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <h3 className="font-semibold text-[#484848]">{details.listing.title}</h3>
            {details.booking && (
              <p className="text-sm text-[#767676]">
                {formatBookingDates(details.booking.checkIn, details.booking.checkOut)}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {details.messages.map((message, index) => {
          const prevMessage = index > 0 ? details.messages[index - 1] : null
          const showTimestamp = shouldShowTimestamp(
            message.createdAt,
            prevMessage?.createdAt ?? null
          )

          return (
            <div key={message.id}>
              {showTimestamp && (
                <div className="text-center text-xs text-[#767676] my-4">
                  {formatDate(message.createdAt)} at {formatTime(message.createdAt)}
                </div>
              )}
              <div
                className={`flex ${message.isFromMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    message.isFromMe
                      ? 'bg-[#0095F6] text-white'
                      : 'bg-[#EBEBEB] text-[#484848]'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput
        receiverId={otherUserId}
        listingId={listingId}
        onMessageSent={onMessageSent}
      />
    </div>
  )
}
