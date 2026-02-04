'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import { sendMessage } from '@/actions/messages'

export function MessageInput({
  receiverId,
  listingId,
  onMessageSent,
  defaultMessage = '',
}: {
  receiverId: number
  listingId: number
  onMessageSent: () => void
  defaultMessage?: string
}) {
  const [message, setMessage] = useState(defaultMessage)
  const [sending, setSending] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async () => {
    if (!message.trim() || sending) return

    setSending(true)
    const result = await sendMessage(receiverId, listingId, message)
    setSending(false)

    if (result.success) {
      setMessage('')
      onMessageSent()
      textareaRef.current?.focus()
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="p-4 border-t border-[#EBEBEB]">
      <div className="flex gap-2">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={2}
          className="flex-1 resize-none border border-[#EBEBEB] rounded-lg px-4 py-2 focus:outline-none focus:border-[#FF5A5F] text-[#484848]"
        />
        <button
          onClick={handleSubmit}
          disabled={!message.trim() || sending}
          className="px-6 py-2 bg-[#FF5A5F] text-white font-semibold rounded-lg hover:bg-[#E04E52] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {sending ? 'Sending...' : 'Send'}
        </button>
      </div>
      <p className="text-xs text-[#767676] mt-1">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  )
}
