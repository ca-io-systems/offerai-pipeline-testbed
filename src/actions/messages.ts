'use server'

import { db } from '@/db'
import { messages, users } from '@/db/schema'
import { getCurrentUserId } from '@/lib/auth'
import { generateId } from '@/lib/utils'
import { createNotification } from './notifications'
import { eq } from 'drizzle-orm'

export async function sendMessage(data: {
  recipientId: string
  content: string
  bookingId?: string
}): Promise<{ id: string }> {
  const senderId = getCurrentUserId()

  const messageId = generateId()

  await db.insert(messages).values({
    id: messageId,
    senderId,
    recipientId: data.recipientId,
    bookingId: data.bookingId ?? null,
    content: data.content,
    createdAt: new Date(),
  })

  // Get sender info
  const [sender] = await db.select().from(users).where(eq(users.id, senderId))

  // Notify recipient
  await createNotification({
    userId: data.recipientId,
    type: 'message_received',
    title: 'New Message',
    body: `${sender?.name ?? 'Someone'}: ${data.content.slice(0, 50)}${data.content.length > 50 ? '...' : ''}`,
    linkUrl: `/messages/${senderId}`,
  })

  return { id: messageId }
}
