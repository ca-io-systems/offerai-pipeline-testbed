import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { cookies } from 'next/headers'

// Simple auth simulation - in production, use proper session management
export async function getCurrentUser() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value

  if (!userId) {
    return null
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, parseInt(userId, 10)),
  })

  return user || null
}

export async function isAdmin() {
  const user = await getCurrentUser()
  return user?.isAdmin === true
}

// For development/testing: get admin user directly
export async function getAdminUser() {
  const admin = await db.query.users.findFirst({
    where: eq(users.email, 'admin@offerbnb.com'),
  })
  return admin
}
