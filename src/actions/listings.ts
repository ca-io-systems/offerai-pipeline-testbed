'use server'

import { db } from '@/db'
import { listings } from '@/db/schema'
import type { Listing } from '@/db/schema'

export async function getListings(): Promise<Listing[]> {
  return db.query.listings.findMany()
}

export async function getListingById(id: string): Promise<Listing | null> {
  const listing = await db.query.listings.findFirst({
    where: (listings, { eq }) => eq(listings.id, id),
  })
  return listing ?? null
}
