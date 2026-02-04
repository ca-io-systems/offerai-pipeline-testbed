'use client'

import { useOptimisticList } from '@/hooks/useOptimisticList'
import { ReactNode } from 'react'

type Message = {
  id: string
  content: string
  senderId: string
  createdAt: string
}

type OptimisticMessageListProps = {
  initialMessages: Message[]
  currentUserId: string
  onSendMessage: (message: Message) => Promise<void>
  renderMessage: (message: Message, isOwn: boolean, isPending: boolean) => ReactNode
  className?: string
}

export function OptimisticMessageList({
  initialMessages,
  currentUserId,
  onSendMessage,
  renderMessage,
  className = '',
}: OptimisticMessageListProps) {
  const { items: messages, isPending, error, addItem } = useOptimisticList({
    initialItems: initialMessages,
    onAdd: onSendMessage,
    getId: (message) => message.id,
  })

  const sendMessage = (content: string) => {
    const newMessage: Message = {
      id: `temp-${Date.now()}`,
      content,
      senderId: currentUserId,
      createdAt: new Date().toISOString(),
    }
    addItem(newMessage)
  }

  return (
    <div className={className}>
      {error && (
        <div className="mb-4 rounded-lg bg-error/10 p-3 text-error text-sm">
          Failed to send message. Please try again.
        </div>
      )}
      <div className="space-y-2">
        {messages.map((message) => {
          const isOwn = message.senderId === currentUserId
          const isPendingMessage = message.id.startsWith('temp-')
          return (
            <div key={message.id}>
              {renderMessage(message, isOwn, isPendingMessage)}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export type { Message }
