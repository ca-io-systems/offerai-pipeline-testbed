import Image from 'next/image'
import Link from 'next/link'

const conversations = [
  {
    id: '1',
    host: 'Sarah',
    hostImage: 'https://picsum.photos/seed/conv1/100/100',
    listing: 'Ocean View Apartment',
    lastMessage: 'Looking forward to hosting you! Let me know if you have any questions.',
    timestamp: '2 hours ago',
    unread: true,
  },
  {
    id: '2',
    host: 'Mike',
    hostImage: 'https://picsum.photos/seed/conv2/100/100',
    listing: 'Mountain Cabin',
    lastMessage: 'Thanks for your stay! Hope you enjoyed it.',
    timestamp: '3 days ago',
    unread: false,
  },
  {
    id: '3',
    host: 'Emily',
    hostImage: 'https://picsum.photos/seed/conv3/100/100',
    listing: 'Downtown Loft',
    lastMessage: 'Your booking has been confirmed!',
    timestamp: '1 week ago',
    unread: false,
  },
]

export default function InboxPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl md:text-3xl font-bold text-[#484848] mb-6">Inbox</h1>

      {conversations.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-[#EBEBEB] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h2 className="text-xl font-semibold text-[#484848] mb-2">No messages yet</h2>
          <p className="text-[#767676] max-w-md mx-auto">
            When you book a trip or experience, messages from your host will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#EBEBEB] overflow-hidden">
          {conversations.map((conversation, index) => (
            <Link
              key={conversation.id}
              href={`/inbox/${conversation.id}`}
              className={`flex items-start gap-4 p-4 hover:bg-[#F7F7F7] transition-colors ${
                index !== conversations.length - 1 ? 'border-b border-[#EBEBEB]' : ''
              }`}
            >
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src={conversation.hostImage}
                  alt={conversation.host}
                  fill
                  className="rounded-full object-cover"
                />
                {conversation.unread && (
                  <div className="absolute top-0 right-0 w-3 h-3 bg-[#FF5A5F] rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className={`font-medium text-[#484848] truncate ${conversation.unread ? 'font-semibold' : ''}`}>
                    {conversation.host}
                  </h3>
                  <span className="text-xs text-[#767676] flex-shrink-0">{conversation.timestamp}</span>
                </div>
                <p className="text-sm text-[#767676] truncate">{conversation.listing}</p>
                <p className={`text-sm mt-1 truncate ${conversation.unread ? 'text-[#484848] font-medium' : 'text-[#767676]'}`}>
                  {conversation.lastMessage}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
