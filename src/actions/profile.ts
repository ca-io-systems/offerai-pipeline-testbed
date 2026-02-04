'use server'

import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export interface UpdateProfileData {
  name: string
  bio: string
  location: string
  phone: string
  emergencyContact: string
  avatarUrl: string
}

export async function updateProfile(userId: number, data: UpdateProfileData) {
  const [updated] = await db
    .update(users)
    .set({
      name: data.name,
      bio: data.bio || null,
      location: data.location || null,
      phone: data.phone || null,
      emergencyContact: data.emergencyContact || null,
      avatarUrl: data.avatarUrl || null,
    })
    .where(eq(users.id, userId))
    .returning()

  return updated
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
}

export async function changePassword(userId: number, data: ChangePasswordData) {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1)

  if (!user) {
    return { success: false, error: 'User not found' }
  }

  // In a real app, we would verify the current password hash
  // For this mock, we just check if current password is not empty
  if (!data.currentPassword) {
    return { success: false, error: 'Current password is required' }
  }

  if (data.newPassword.length < 6) {
    return { success: false, error: 'New password must be at least 6 characters' }
  }

  // Update with new password hash (mock - would be hashed in real app)
  await db
    .update(users)
    .set({ passwordHash: `hashed_${data.newPassword}` })
    .where(eq(users.id, userId))

  return { success: true }
}

export async function deleteAccount(userId: number) {
  await db.delete(users).where(eq(users.id, userId))
  return { success: true }
}
