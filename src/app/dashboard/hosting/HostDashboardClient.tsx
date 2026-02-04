'use client'

import { useState } from 'react'
import Link from 'next/link'
import DashboardNav from '@/components/DashboardNav'
import ListingsTab from '@/components/ListingsTab'
import ReservationsTab from '@/components/ReservationsTab'
import EarningsTab from '@/components/EarningsTab'
import { ListingWithStats } from '@/actions/listings'
import { ReservationWithDetails } from '@/actions/reservations'
import { EarningsSummary, MonthlyEarning, EarningsTransaction } from '@/actions/earnings'

type Tab = 'listings' | 'reservations' | 'earnings'

type Props = {
  listings: ListingWithStats[]
  reservations: ReservationWithDetails[]
  summary: EarningsSummary
  monthlyEarnings: MonthlyEarning[]
  transactions: EarningsTransaction[]
}

export default function HostDashboardClient({
  listings,
  reservations,
  summary,
  monthlyEarnings,
  transactions,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('listings')
  
  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Header */}
      <header className="bg-white border-b border-[#EBEBEB]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-[#FF5A5F]">
            OfferBnb
          </Link>
          <h1 className="text-lg font-semibold">Host Dashboard</h1>
        </div>
      </header>
      
      {/* Navigation Tabs */}
      <DashboardNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'listings' && <ListingsTab initialListings={listings} />}
        {activeTab === 'reservations' && <ReservationsTab initialReservations={reservations} />}
        {activeTab === 'earnings' && (
          <EarningsTab
            summary={summary}
            monthlyEarnings={monthlyEarnings}
            transactions={transactions}
          />
        )}
      </main>
    </div>
  )
}
