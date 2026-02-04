'use server'

import { db } from '@/db'
import { reports, listings } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function updateReportStatus(
  id: number,
  status: 'pending' | 'dismissed' | 'actioned'
) {
  await db.update(reports).set({ status }).where(eq(reports.id, id))
  revalidatePath('/admin/reports')
  revalidatePath('/admin')
}

export async function warnHost(hostId: number, reportId: number) {
  // In a real app, this would send an email to the host
  console.log(`Warning sent to host ${hostId} for report ${reportId}`)

  await db.update(reports).set({ status: 'actioned' }).where(eq(reports.id, reportId))
  revalidatePath('/admin/reports')
  revalidatePath('/admin')
}

export async function removeContent(listingId: number, reportId: number) {
  // Suspend the listing
  await db
    .update(listings)
    .set({ status: 'suspended', isFlagged: true })
    .where(eq(listings.id, listingId))

  // Mark report as actioned
  await db.update(reports).set({ status: 'actioned' }).where(eq(reports.id, reportId))

  revalidatePath('/admin/reports')
  revalidatePath('/admin/listings')
  revalidatePath('/admin/moderation')
  revalidatePath('/admin')
}
