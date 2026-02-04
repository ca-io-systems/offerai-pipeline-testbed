'use server'

import { db } from '@/db/index'
import { reservations, listings, users } from '@/db/schema'
import { eq, and, gte, lte } from 'drizzle-orm'
import { requireHostAuth } from '@/lib/auth'

export type EarningsSummary = {
  totalAllTime: number
  thisMonth: number
  pendingPayouts: number
}

export type MonthlyEarning = {
  month: string
  year: number
  amount: number
}

export type EarningsTransaction = {
  id: string
  date: Date
  listingTitle: string
  guestName: string
  amount: number
  payoutStatus: 'pending' | 'processing' | 'paid'
}

export async function getEarningsSummary(): Promise<EarningsSummary> {
  const hostId = requireHostAuth()
  
  const hostListings = await db
    .select({ id: listings.id })
    .from(listings)
    .where(eq(listings.hostId, hostId))
  
  const listingIds = hostListings.map(l => l.id)
  if (listingIds.length === 0) {
    return { totalAllTime: 0, thisMonth: 0, pendingPayouts: 0 }
  }
  
  const allReservations = await db
    .select({
      hostPayout: reservations.hostPayout,
      payoutStatus: reservations.payoutStatus,
      status: reservations.status,
      checkOut: reservations.checkOut,
    })
    .from(reservations)
    .innerJoin(listings, eq(reservations.listingId, listings.id))
    .where(eq(listings.hostId, hostId))
  
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  
  let totalAllTime = 0
  let thisMonth = 0
  let pendingPayouts = 0
  
  for (const res of allReservations) {
    if (res.status === 'completed' || res.status === 'confirmed') {
      totalAllTime += res.hostPayout
      
      if (res.checkOut >= startOfMonth) {
        thisMonth += res.hostPayout
      }
      
      if (res.payoutStatus === 'pending' || res.payoutStatus === 'processing') {
        pendingPayouts += res.hostPayout
      }
    }
  }
  
  return { totalAllTime, thisMonth, pendingPayouts }
}

export async function getMonthlyEarnings(): Promise<MonthlyEarning[]> {
  const hostId = requireHostAuth()
  
  const hostListings = await db
    .select({ id: listings.id })
    .from(listings)
    .where(eq(listings.hostId, hostId))
  
  if (hostListings.length === 0) return []
  
  const now = new Date()
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1)
  
  const completedReservations = await db
    .select({
      hostPayout: reservations.hostPayout,
      checkOut: reservations.checkOut,
    })
    .from(reservations)
    .innerJoin(listings, eq(reservations.listingId, listings.id))
    .where(
      and(
        eq(listings.hostId, hostId),
        eq(reservations.status, 'completed')
      )
    )
  
  // Group by month
  const monthlyMap = new Map<string, number>()
  
  // Initialize all 12 months with 0
  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    monthlyMap.set(key, 0)
  }
  
  // Add actual earnings
  for (const res of completedReservations) {
    const checkOut = new Date(res.checkOut)
    if (checkOut >= twelveMonthsAgo) {
      const key = `${checkOut.getFullYear()}-${String(checkOut.getMonth() + 1).padStart(2, '0')}`
      if (monthlyMap.has(key)) {
        monthlyMap.set(key, (monthlyMap.get(key) || 0) + res.hostPayout)
      }
    }
  }
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  return Array.from(monthlyMap.entries()).map(([key, amount]) => {
    const [year, month] = key.split('-')
    return {
      month: months[parseInt(month, 10) - 1],
      year: parseInt(year, 10),
      amount,
    }
  })
}

export async function getEarningsTransactions(): Promise<EarningsTransaction[]> {
  const hostId = requireHostAuth()
  
  const results = await db
    .select({
      id: reservations.id,
      date: reservations.checkOut,
      listingTitle: listings.title,
      guestName: users.name,
      amount: reservations.hostPayout,
      payoutStatus: reservations.payoutStatus,
    })
    .from(reservations)
    .innerJoin(listings, eq(reservations.listingId, listings.id))
    .innerJoin(users, eq(reservations.guestId, users.id))
    .where(
      and(
        eq(listings.hostId, hostId),
        eq(reservations.status, 'completed')
      )
    )
  
  return results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function exportEarningsCSV(): Promise<string> {
  const transactions = await getEarningsTransactions()
  
  const headers = ['Date', 'Listing', 'Guest', 'Amount', 'Payout Status']
  const rows = transactions.map(t => [
    new Date(t.date).toLocaleDateString(),
    t.listingTitle,
    t.guestName,
    `$${t.amount.toFixed(2)}`,
    t.payoutStatus,
  ])
  
  const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
  return csv
}
