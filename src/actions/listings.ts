'use server'

import { db } from '@/db'
import { listings } from '@/db/schema'
import { eq, inArray } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function updateListingStatus(
  id: number,
  status: 'pending' | 'approved' | 'suspended'
) {
  await db.update(listings).set({ status }).where(eq(listings.id, id))
  revalidatePath('/admin/listings')
  revalidatePath('/admin/moderation')
}

export async function flagListing(id: number) {
  const [listing] = await db
    .select({ isFlagged: listings.isFlagged })
    .from(listings)
    .where(eq(listings.id, id))

  await db
    .update(listings)
    .set({ isFlagged: !listing.isFlagged })
    .where(eq(listings.id, id))

  revalidatePath('/admin/listings')
  revalidatePath('/admin/moderation')
}

export async function bulkUpdateListings(
  ids: number[],
  action: 'approve' | 'suspend' | 'delete'
) {
  if (action === 'delete') {
    await db.delete(listings).where(inArray(listings.id, ids))
  } else {
    const status = action === 'approve' ? 'approved' : 'suspended'
    await db.update(listings).set({ status }).where(inArray(listings.id, ids))
  }

  revalidatePath('/admin/listings')
  revalidatePath('/admin/moderation')
  revalidatePath('/admin')
}

export async function deleteListing(id: number) {
  await db.delete(listings).where(eq(listings.id, id))
  revalidatePath('/admin/listings')
  revalidatePath('/admin/moderation')
  revalidatePath('/admin')
}
