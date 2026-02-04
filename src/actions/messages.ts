'use server'

import { db } from '@/db'
import { messages, users, listings, bookings } from '@/db/schema'
import { eq, and, or, desc, sql } from 'drizzle-orm'
import { getCurrentUserId } from '@/lib/auth'

export type Conversation = {
  id: string
  otherUser: {
    id: number
    name: string
    avatar: string | null
  }
  listing: {
    id: number
    title: string
    image: string
  }
  lastMessage: {
    content: string
    createdAt: Date
    isFromMe: boolean
  }
  hasUnread: boolean
}

export type MessageWithSender = {
  id: number
  content: string
  createdAt: Date
  isFromMe: boolean
  sender: {
    id: number
    name: string
    avatar: string | null
  }
}

export type ConversationDetails = {
  otherUser: {
    id: number
    name: string
    avatar: string | null
  }
  listing: {
    id: number
    title: string
    image: string
  }
  booking: {
    checkIn: Date
    checkOut: Date
  } | null
  messages: MessageWithSender[]
}

export async function getConversations(): Promise<Conversation[]> {
  const currentUserId = getCurrentUserId()

  const allMessages = await db
    .select({
      id: messages.id,
      senderId: messages.senderId,
      receiverId: messages.receiverId,
      listingId: messages.listingId,
      content: messages.content,
      isRead: messages.isRead,
      createdAt: messages.createdAt,
      senderName: users.name,
      senderAvatar: users.avatar,
    })
    .from(messages)
    .innerJoin(users, eq(messages.senderId, users.id))
    .where(
      or(
        eq(messages.senderId, currentUserId),
        eq(messages.receiverId, currentUserId)
      )
    )
    .orderBy(desc(messages.createdAt))

  const conversationMap = new Map<string, {
    messages: typeof allMessages
    otherUserId: number
    listingId: number
  }>()

  for (const msg of allMessages) {
    const otherUserId = msg.senderId === currentUserId ? msg.receiverId : msg.senderId
    const key = `${Math.min(currentUserId, otherUserId)}-${Math.max(currentUserId, otherUserId)}-${msg.listingId}`

    if (!conversationMap.has(key)) {
      conversationMap.set(key, {
        messages: [],
        otherUserId,
        listingId: msg.listingId,
      })
    }
    conversationMap.get(key)!.messages.push(msg)
  }

  const conversations: Conversation[] = []

  for (const [key, conv] of conversationMap) {
    const lastMsg = conv.messages[0]

    const [otherUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, conv.otherUserId))

    const [listing] = await db
      .select()
      .from(listings)
      .where(eq(listings.id, conv.listingId))

    if (!otherUser || !listing) continue

    const hasUnread = conv.messages.some(
      (m) => m.receiverId === currentUserId && !m.isRead
    )

    conversations.push({
      id: key,
      otherUser: {
        id: otherUser.id,
        name: otherUser.name,
        avatar: otherUser.avatar,
      },
      listing: {
        id: listing.id,
        title: listing.title,
        image: listing.image,
      },
      lastMessage: {
        content: lastMsg.content,
        createdAt: lastMsg.createdAt,
        isFromMe: lastMsg.senderId === currentUserId,
      },
      hasUnread,
    })
  }

  return conversations.sort(
    (a, b) => b.lastMessage.createdAt.getTime() - a.lastMessage.createdAt.getTime()
  )
}

export async function getConversationMessages(
  otherUserId: number,
  listingId: number
): Promise<ConversationDetails | null> {
  const currentUserId = getCurrentUserId()

  const [otherUser] = await db
    .select()
    .from(users)
    .where(eq(users.id, otherUserId))

  const [listing] = await db
    .select()
    .from(listings)
    .where(eq(listings.id, listingId))

  if (!otherUser || !listing) return null

  const conversationMessages = await db
    .select({
      id: messages.id,
      content: messages.content,
      createdAt: messages.createdAt,
      senderId: messages.senderId,
      senderName: users.name,
      senderAvatar: users.avatar,
    })
    .from(messages)
    .innerJoin(users, eq(messages.senderId, users.id))
    .where(
      and(
        eq(messages.listingId, listingId),
        or(
          and(
            eq(messages.senderId, currentUserId),
            eq(messages.receiverId, otherUserId)
          ),
          and(
            eq(messages.senderId, otherUserId),
            eq(messages.receiverId, currentUserId)
          )
        )
      )
    )
    .orderBy(messages.createdAt)

  const [booking] = await db
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.listingId, listingId),
        or(
          eq(bookings.guestId, currentUserId),
          eq(bookings.guestId, otherUserId)
        )
      )
    )

  return {
    otherUser: {
      id: otherUser.id,
      name: otherUser.name,
      avatar: otherUser.avatar,
    },
    listing: {
      id: listing.id,
      title: listing.title,
      image: listing.image,
    },
    booking: booking
      ? {
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
        }
      : null,
    messages: conversationMessages.map((m) => ({
      id: m.id,
      content: m.content,
      createdAt: m.createdAt,
      isFromMe: m.senderId === currentUserId,
      sender: {
        id: m.senderId,
        name: m.senderName,
        avatar: m.senderAvatar,
      },
    })),
  }
}

export async function sendMessage(
  receiverId: number,
  listingId: number,
  content: string
): Promise<{ success: boolean; error?: string }> {
  const currentUserId = getCurrentUserId()

  if (!content.trim()) {
    return { success: false, error: 'Message cannot be empty' }
  }

  await db.insert(messages).values({
    senderId: currentUserId,
    receiverId,
    listingId,
    content: content.trim(),
    isRead: false,
  })

  return { success: true }
}

export async function markAsRead(
  otherUserId: number,
  listingId: number
): Promise<void> {
  const currentUserId = getCurrentUserId()

  await db
    .update(messages)
    .set({ isRead: true })
    .where(
      and(
        eq(messages.senderId, otherUserId),
        eq(messages.receiverId, currentUserId),
        eq(messages.listingId, listingId),
        eq(messages.isRead, false)
      )
    )
}

export async function getUnreadCount(): Promise<number> {
  const currentUserId = getCurrentUserId()

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(messages)
    .where(
      and(
        eq(messages.receiverId, currentUserId),
        eq(messages.isRead, false)
      )
    )

  return result[0]?.count ?? 0
}

export async function getOrCreateConversation(
  hostId: number,
  listingId: number
): Promise<{ otherUserId: number; listingId: number }> {
  return { otherUserId: hostId, listingId }
}
