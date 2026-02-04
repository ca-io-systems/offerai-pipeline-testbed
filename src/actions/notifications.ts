'use server'

import { db } from '@/db'
import { notifications, notificationPreferences, type NotificationType } from '@/db/schema'
import { getCurrentUserId } from '@/lib/auth'
import { generateId } from '@/lib/utils'
import { eq, desc, and, count } from 'drizzle-orm'

export type NotificationWithMeta = {
  id: string
  type: NotificationType
  title: string
  body: string
  linkUrl: string | null
  isRead: boolean
  createdAt: Date
}

export type GetNotificationsResult = {
  notifications: NotificationWithMeta[]
  total: number
  unreadCount: number
}

export async function getNotifications(options?: {
  limit?: number
  offset?: number
  type?: NotificationType
  unreadOnly?: boolean
}): Promise<GetNotificationsResult> {
  const userId = getCurrentUserId()
  const limit = options?.limit ?? 10
  const offset = options?.offset ?? 0

  const conditions = [eq(notifications.userId, userId)]

  if (options?.type) {
    conditions.push(eq(notifications.type, options.type))
  }

  if (options?.unreadOnly) {
    conditions.push(eq(notifications.isRead, false))
  }

  const results = await db
    .select()
    .from(notifications)
    .where(and(...conditions))
    .orderBy(desc(notifications.createdAt))
    .limit(limit)
    .offset(offset)

  const [totalResult] = await db
    .select({ count: count() })
    .from(notifications)
    .where(and(...conditions))

  const [unreadResult] = await db
    .select({ count: count() })
    .from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)))

  return {
    notifications: results.map(n => ({
      id: n.id,
      type: n.type,
      title: n.title,
      body: n.body,
      linkUrl: n.linkUrl,
      isRead: n.isRead,
      createdAt: n.createdAt,
    })),
    total: totalResult?.count ?? 0,
    unreadCount: unreadResult?.count ?? 0,
  }
}

export async function getUnreadCount(): Promise<number> {
  const userId = getCurrentUserId()

  const [result] = await db
    .select({ count: count() })
    .from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)))

  return result?.count ?? 0
}

export async function markAsRead(notificationId: string): Promise<void> {
  const userId = getCurrentUserId()

  await db
    .update(notifications)
    .set({ isRead: true })
    .where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)))
}

export async function markAllAsRead(): Promise<void> {
  const userId = getCurrentUserId()

  await db
    .update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.userId, userId))
}

export type NotificationPreferencesData = {
  bookingConfirmedInApp: boolean
  bookingConfirmedEmail: boolean
  bookingRequestInApp: boolean
  bookingRequestEmail: boolean
  bookingCancelledInApp: boolean
  bookingCancelledEmail: boolean
  reviewReceivedInApp: boolean
  reviewReceivedEmail: boolean
  messageReceivedInApp: boolean
  messageReceivedEmail: boolean
  listingPublishedInApp: boolean
  listingPublishedEmail: boolean
  priceChangeInApp: boolean
  priceChangeEmail: boolean
}

const defaultPreferences: NotificationPreferencesData = {
  bookingConfirmedInApp: true,
  bookingConfirmedEmail: true,
  bookingRequestInApp: true,
  bookingRequestEmail: true,
  bookingCancelledInApp: true,
  bookingCancelledEmail: true,
  reviewReceivedInApp: true,
  reviewReceivedEmail: true,
  messageReceivedInApp: true,
  messageReceivedEmail: true,
  listingPublishedInApp: true,
  listingPublishedEmail: true,
  priceChangeInApp: true,
  priceChangeEmail: true,
}

export async function getNotificationPreferences(): Promise<NotificationPreferencesData> {
  const userId = getCurrentUserId()

  const [prefs] = await db
    .select()
    .from(notificationPreferences)
    .where(eq(notificationPreferences.userId, userId))

  if (!prefs) {
    return defaultPreferences
  }

  return {
    bookingConfirmedInApp: prefs.bookingConfirmedInApp,
    bookingConfirmedEmail: prefs.bookingConfirmedEmail,
    bookingRequestInApp: prefs.bookingRequestInApp,
    bookingRequestEmail: prefs.bookingRequestEmail,
    bookingCancelledInApp: prefs.bookingCancelledInApp,
    bookingCancelledEmail: prefs.bookingCancelledEmail,
    reviewReceivedInApp: prefs.reviewReceivedInApp,
    reviewReceivedEmail: prefs.reviewReceivedEmail,
    messageReceivedInApp: prefs.messageReceivedInApp,
    messageReceivedEmail: prefs.messageReceivedEmail,
    listingPublishedInApp: prefs.listingPublishedInApp,
    listingPublishedEmail: prefs.listingPublishedEmail,
    priceChangeInApp: prefs.priceChangeInApp,
    priceChangeEmail: prefs.priceChangeEmail,
  }
}

export async function updateNotificationPreferences(
  data: Partial<NotificationPreferencesData>
): Promise<void> {
  const userId = getCurrentUserId()

  const [existing] = await db
    .select()
    .from(notificationPreferences)
    .where(eq(notificationPreferences.userId, userId))

  if (existing) {
    await db
      .update(notificationPreferences)
      .set(data)
      .where(eq(notificationPreferences.userId, userId))
  } else {
    await db.insert(notificationPreferences).values({
      id: generateId(),
      userId,
      ...defaultPreferences,
      ...data,
    })
  }
}

// Helper to create notifications (called from other actions)
export async function createNotification(data: {
  userId: string
  type: NotificationType
  title: string
  body: string
  linkUrl?: string
}): Promise<void> {
  // Check user preferences before creating notification
  const [prefs] = await db
    .select()
    .from(notificationPreferences)
    .where(eq(notificationPreferences.userId, data.userId))

  const prefKey = `${data.type.replace(/_([a-z])/g, (_, c) => c.toUpperCase())}InApp` as keyof NotificationPreferencesData
  const shouldNotify = prefs ? prefs[prefKey as keyof typeof prefs] : true

  if (!shouldNotify) {
    return
  }

  await db.insert(notifications).values({
    id: generateId(),
    userId: data.userId,
    type: data.type,
    title: data.title,
    body: data.body,
    linkUrl: data.linkUrl ?? null,
    isRead: false,
    createdAt: new Date(),
  })
}
