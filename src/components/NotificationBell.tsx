'use client'

import { useState, useEffect, useRef } from 'react'
import { getNotifications, markAllAsRead, type NotificationWithMeta } from '@/actions/notifications'
import { NotificationCard } from './NotificationCard'
import Link from 'next/link'

type NotificationBellProps = {
  initialUnreadCount?: number
}

export function NotificationBell({ initialUnreadCount = 0 }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationWithMeta[]>([])
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const result = await getNotifications({ limit: 5 })
      setNotifications(result.notifications)
      setUnreadCount(result.unreadCount)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMarkAllAsRead = async () => {
    await markAllAsRead()
    setUnreadCount(0)
    setNotifications(notifications.map(n => ({ ...n, isRead: true })))
  }

  const handleNotificationRead = () => {
    setUnreadCount(prev => Math.max(0, prev - 1))
    fetchNotifications()
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Notifications"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No notifications</div>
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

          <div className="p-3 border-t border-gray-200">
            <Link
              href="/notifications"
              className="block text-center text-sm text-blue-600 hover:text-blue-800"
              onClick={() => setIsOpen(false)}
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
