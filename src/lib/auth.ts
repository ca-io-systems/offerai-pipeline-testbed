import { cookies } from 'next/headers'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value
  
  if (!userId) {
    return null
  }
  
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  })
  
  return user ?? null
}

export async function setCurrentUser(userId: string) {
  const cookieStore = await cookies()
  cookieStore.set('userId', userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })
}

export async function clearCurrentUser() {
  const cookieStore = await cookies()
  cookieStore.delete('userId')
}
