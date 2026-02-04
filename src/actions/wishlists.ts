'use server'

import { db } from '@/db'
import { wishlists, wishlistItems, listings } from '@/db/schema'
import { getCurrentUser } from '@/lib/auth'
import { generateId } from '@/lib/utils'
import { eq, and, inArray } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export type WishlistWithItems = {
  id: string
  name: string
  userId: string
  isPublic: boolean
  shareToken: string | null
  createdAt: Date
  items: {
    listingId: string
    imageUrl: string
  }[]
  itemCount: number
}

export async function getWishlists(): Promise<WishlistWithItems[]> {
  const user = await getCurrentUser()
  if (!user) return []

  const userWishlists = await db.query.wishlists.findMany({
    where: eq(wishlists.userId, user.id),
  })

  const wishlistsWithItems: WishlistWithItems[] = []

  for (const wishlist of userWishlists) {
    const items = await db
      .select({
        listingId: wishlistItems.listingId,
        imageUrl: listings.imageUrl,
      })
      .from(wishlistItems)
      .innerJoin(listings, eq(wishlistItems.listingId, listings.id))
      .where(eq(wishlistItems.wishlistId, wishlist.id))
      .limit(3)

    const countResult = await db
      .select({ listingId: wishlistItems.listingId })
      .from(wishlistItems)
      .where(eq(wishlistItems.wishlistId, wishlist.id))

    wishlistsWithItems.push({
      ...wishlist,
      items,
      itemCount: countResult.length,
    })
  }

  return wishlistsWithItems
}

export async function getWishlistById(wishlistId: string) {
  const user = await getCurrentUser()
  
  const wishlist = await db.query.wishlists.findFirst({
    where: eq(wishlists.id, wishlistId),
  })

  if (!wishlist) return null

  // Check if user has access (owner or public wishlist)
  if (wishlist.userId !== user?.id && !wishlist.isPublic) {
    return null
  }

  const items = await db
    .select({
      listingId: wishlistItems.listingId,
      addedAt: wishlistItems.addedAt,
      listing: listings,
    })
    .from(wishlistItems)
    .innerJoin(listings, eq(wishlistItems.listingId, listings.id))
    .where(eq(wishlistItems.wishlistId, wishlistId))

  return {
    ...wishlist,
    items: items.map((item) => ({
      ...item.listing,
      addedAt: item.addedAt,
    })),
    isOwner: wishlist.userId === user?.id,
  }
}

export async function getWishlistByShareToken(shareToken: string) {
  const wishlist = await db.query.wishlists.findFirst({
    where: eq(wishlists.shareToken, shareToken),
  })

  if (!wishlist) return null

  const items = await db
    .select({
      listingId: wishlistItems.listingId,
      addedAt: wishlistItems.addedAt,
      listing: listings,
    })
    .from(wishlistItems)
    .innerJoin(listings, eq(wishlistItems.listingId, listings.id))
    .where(eq(wishlistItems.wishlistId, wishlist.id))

  return {
    ...wishlist,
    items: items.map((item) => ({
      ...item.listing,
      addedAt: item.addedAt,
    })),
    isOwner: false,
  }
}

export async function createWishlist(name: string): Promise<{ success: boolean; wishlistId?: string; error?: string }> {
  const user = await getCurrentUser()
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const id = generateId()
  const shareToken = generateId().slice(0, 8)

  await db.insert(wishlists).values({
    id,
    name,
    userId: user.id,
    isPublic: false,
    shareToken,
  })

  revalidatePath('/wishlists')
  return { success: true, wishlistId: id }
}

export async function updateWishlist(wishlistId: string, name: string): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser()
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const wishlist = await db.query.wishlists.findFirst({
    where: eq(wishlists.id, wishlistId),
  })

  if (!wishlist || wishlist.userId !== user.id) {
    return { success: false, error: 'Wishlist not found' }
  }

  await db.update(wishlists).set({ name }).where(eq(wishlists.id, wishlistId))

  revalidatePath('/wishlists')
  revalidatePath(`/wishlists/${wishlistId}`)
  return { success: true }
}

export async function deleteWishlist(wishlistId: string): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser()
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const wishlist = await db.query.wishlists.findFirst({
    where: eq(wishlists.id, wishlistId),
  })

  if (!wishlist || wishlist.userId !== user.id) {
    return { success: false, error: 'Wishlist not found' }
  }

  await db.delete(wishlists).where(eq(wishlists.id, wishlistId))

  revalidatePath('/wishlists')
  return { success: true }
}

export async function toggleWishlistItem(
  listingId: string,
  wishlistId: string
): Promise<{ success: boolean; added: boolean; wishlistName?: string; error?: string }> {
  const user = await getCurrentUser()
  if (!user) {
    return { success: false, added: false, error: 'Not authenticated' }
  }

  const wishlist = await db.query.wishlists.findFirst({
    where: eq(wishlists.id, wishlistId),
  })

  if (!wishlist || wishlist.userId !== user.id) {
    return { success: false, added: false, error: 'Wishlist not found' }
  }

  const existingItem = await db.query.wishlistItems.findFirst({
    where: and(
      eq(wishlistItems.wishlistId, wishlistId),
      eq(wishlistItems.listingId, listingId)
    ),
  })

  if (existingItem) {
    await db.delete(wishlistItems).where(
      and(
        eq(wishlistItems.wishlistId, wishlistId),
        eq(wishlistItems.listingId, listingId)
      )
    )
    revalidatePath('/wishlists')
    revalidatePath(`/wishlists/${wishlistId}`)
    return { success: true, added: false, wishlistName: wishlist.name }
  } else {
    await db.insert(wishlistItems).values({
      wishlistId,
      listingId,
    })
    revalidatePath('/wishlists')
    revalidatePath(`/wishlists/${wishlistId}`)
    return { success: true, added: true, wishlistName: wishlist.name }
  }
}

export async function removeFromWishlist(
  listingId: string,
  wishlistId: string
): Promise<{ success: boolean; wishlistName?: string; error?: string }> {
  const user = await getCurrentUser()
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const wishlist = await db.query.wishlists.findFirst({
    where: eq(wishlists.id, wishlistId),
  })

  if (!wishlist || wishlist.userId !== user.id) {
    return { success: false, error: 'Wishlist not found' }
  }

  await db.delete(wishlistItems).where(
    and(
      eq(wishlistItems.wishlistId, wishlistId),
      eq(wishlistItems.listingId, listingId)
    )
  )

  revalidatePath('/wishlists')
  revalidatePath(`/wishlists/${wishlistId}`)
  return { success: true, wishlistName: wishlist.name }
}

export async function getListingWishlists(listingId: string): Promise<{ wishlistId: string; name: string; hasListing: boolean }[]> {
  const user = await getCurrentUser()
  if (!user) return []

  const userWishlists = await db.query.wishlists.findMany({
    where: eq(wishlists.userId, user.id),
  })

  const wishlistIds = userWishlists.map((w) => w.id)
  
  if (wishlistIds.length === 0) {
    return []
  }

  const itemsInWishlists = await db
    .select({ wishlistId: wishlistItems.wishlistId })
    .from(wishlistItems)
    .where(
      and(
        inArray(wishlistItems.wishlistId, wishlistIds),
        eq(wishlistItems.listingId, listingId)
      )
    )

  const wishlistsWithListing = new Set(itemsInWishlists.map((i) => i.wishlistId))

  return userWishlists.map((w) => ({
    wishlistId: w.id,
    name: w.name,
    hasListing: wishlistsWithListing.has(w.id),
  }))
}

export async function isListingSaved(listingId: string): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user) return false

  const userWishlists = await db.query.wishlists.findMany({
    where: eq(wishlists.userId, user.id),
  })

  const wishlistIds = userWishlists.map((w) => w.id)
  
  if (wishlistIds.length === 0) {
    return false
  }

  const item = await db.query.wishlistItems.findFirst({
    where: and(
      inArray(wishlistItems.wishlistId, wishlistIds),
      eq(wishlistItems.listingId, listingId)
    ),
  })

  return !!item
}
