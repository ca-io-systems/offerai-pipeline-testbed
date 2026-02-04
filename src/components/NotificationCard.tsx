'use client'

import { type NotificationType } from '@/db/schema'
import { formatRelativeTime } from '@/lib/utils'
import { NotificationIcon } from './NotificationIcon'
import { markAsRead } from '@/actions/notifications'
import { useRouter } from 'next/navigation'

type NotificationCardProps = {
  id: string
  type: NotificationType
  title: string
  body: string
  linkUrl: string | null
  isRead: boolean
  createdAt: Date
  onRead?: () => void
}

export function NotificationCard({
  id,
  type,
  title,
  body,
  linkUrl,
  isRead,
  createdAt,
  onRead,
}: NotificationCardProps) {
  const router = useRouter()

  const handleClick = async () => {
    if (!isRead) {
      await markAsRead(id)
      onRead?.()
    }
    if (linkUrl) {
      router.push(linkUrl)
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full text-left p-4 flex gap-3 hover:bg-gray-50 transition-colors ${
        !isRead ? 'bg-blue-50' : ''
      }`}
    >
      <div className="flex-shrink-0 mt-0.5">
        <NotificationIcon type={type} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
          {!isRead && (
            <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full" />
          )}
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{body}</p>
        <p className="text-xs text-gray-400 mt-1">
          {formatRelativeTime(new Date(createdAt))}
        </p>
      </div>
    </button>
  )
}
