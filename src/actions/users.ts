'use server'

import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function updateUserRole(id: number, isAdmin: boolean) {
  await db.update(users).set({ isAdmin }).where(eq(users.id, id))
  revalidatePath('/admin/users')
  revalidatePath('/admin')
}

export async function suspendUser(id: number, isSuspended: boolean) {
  await db.update(users).set({ isSuspended }).where(eq(users.id, id))
  revalidatePath('/admin/users')
  revalidatePath('/admin')
}

export async function deleteUser(id: number) {
  await db.delete(users).where(eq(users.id, id))
  revalidatePath('/admin/users')
  revalidatePath('/admin')
}

export async function resetUserPassword(id: number) {
  // In a real app, this would send a password reset email
  // For now, we'll just simulate it
  console.log(`Password reset requested for user ${id}`)
  return { success: true }
}
