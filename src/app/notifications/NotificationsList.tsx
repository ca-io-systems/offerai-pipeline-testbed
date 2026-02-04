'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { notificationTypes, type NotificationType } from '@/db/schema'
import { markAllAsRead, type NotificationWithMeta } from '@/actions/notifications'
import { NotificationCard } from '@/components/NotificationCard'

const typeLabels: Record<NotificationType, string> = {
  booking_confirmed: 'Booking Confirmed',
  booking_request: 'Booking Request',
  booking_cancelled: 'Booking Cancelled',
  review_received: 'Review Received',
  message_received: 'Message Received',
  listing_published: 'Listing Published',
  price_change: 'Price Change',
}

type NotificationsListProps = {
  notifications: NotificationWithMeta[]
  total: number
  page: number
  totalPages: number
  currentType?: NotificationType
  unreadCount: number
}

export function NotificationsList({
  notifications: initialNotifications,
  total,
  page,
  totalPages,
  currentType,
  unreadCount: initialUnreadCount,
}: NotificationsListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [notifications, setNotifications] = useState(initialNotifications)
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount)

  const handleFilterChange = (type: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (type) {
      params.set('type', type)
    } else {
      params.delete('type')
    }
    params.set('page', '1')
    router.push(`/notifications?${params.toString()}`)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    router.push(`/notifications?${params.toString()}`)
  }

  const handleMarkAllAsRead = async () => {
    await markAllAsRead()
    setNotifications(notifications.map(n => ({ ...n, isRead: true })))
    setUnreadCount(0)
    router.refresh()
  }

  const handleNotificationRead = () => {
    setUnreadCount(prev => Math.max(0, prev - 1))
    router.refresh()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="type-filter" className="text-sm text-gray-600">
            Filter by type:
          </label>
          <select
            id="type-filter"
            value={currentType ?? ''}
            onChange={e => handleFilterChange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          >
            <option value="">All notifications</option>
            {notificationTypes.map(type => (
              <option key={type} value={type}>
                {typeLabels[type]}
              </option>
            ))}
          </select>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="px-4 py-2 text-sm font-medium text-white bg-[#FF5A5F] rounded-md hover:bg-[#e54e53] transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 divide-y divide-gray-100">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No notifications found
          </div>
        ) : (
          notifications.map(notification => (
            <NotificationCard
              key={notification.id}
              {...notification}
              onRead={handleNotificationRead}
            />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, total)} of{' '}
            {total} notifications
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
