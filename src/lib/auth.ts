import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
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

export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login?redirect=' + encodeURIComponent('/checkout'))
  }

  return user
}
