'use client'

type Tab = 'listings' | 'reservations' | 'earnings'

type Props = {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'listings', label: 'Listings' },
  { id: 'reservations', label: 'Reservations' },
  { id: 'earnings', label: 'Earnings' },
]

export default function DashboardNav({ activeTab, onTabChange }: Props) {
  return (
    <nav className="bg-white border-b border-[#EBEBEB]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-8">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#FF5A5F] text-[#FF5A5F]'
                  : 'border-transparent text-[#767676] hover:text-[#484848]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
