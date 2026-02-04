'use server'

import { db } from '@/db'
import { users } from '@/db/schema'
import { setCurrentUser, clearCurrentUser, getCurrentUser } from '@/lib/auth'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function login(email: string): Promise<{ success: boolean; error?: string }> {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  })

  if (!user) {
    return { success: false, error: 'User not found' }
  }

  await setCurrentUser(user.id)
  revalidatePath('/')
  return { success: true }
}

export async function logout(): Promise<{ success: boolean }> {
  await clearCurrentUser()
  revalidatePath('/')
  return { success: true }
}

export async function getAuthenticatedUser() {
  return getCurrentUser()
}
