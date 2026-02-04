'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { sendMessage } from '@/actions/messages'

export function ContactHostButton({
  hostId,
  listingId,
  listingTitle,
}: {
  hostId: number
  listingId: number
  listingTitle: string
}) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [message, setMessage] = useState(
    `Hi! I'm interested in your listing "${listingTitle}". Is it available?`
  )
  const [sending, setSending] = useState(false)

  const handleSend = async () => {
    if (!message.trim() || sending) return

    setSending(true)
    const result = await sendMessage(hostId, listingId, message)
    setSending(false)

    if (result.success) {
      setShowModal(false)
      router.push('/messages')
    }
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full py-3 bg-[#FF5A5F] text-white font-semibold rounded-lg hover:bg-[#E04E52] transition-colors"
      >
        Contact Host
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-[#484848] mb-4">Contact Host</h2>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full border border-[#EBEBEB] rounded-lg px-4 py-2 focus:outline-none focus:border-[#FF5A5F] text-[#484848] resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 border border-[#EBEBEB] text-[#484848] font-semibold rounded-lg hover:bg-[#F7F7F7] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={!message.trim() || sending}
                className="flex-1 py-2 bg-[#FF5A5F] text-white font-semibold rounded-lg hover:bg-[#E04E52] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {sending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
