'use client'

import { useState } from 'react'

const tabs = [
  'Destinations for arts & culture',
  'Outdoors',
  'Mountains',
  'Beach',
  'Unique stays',
  'Categories',
  'Things to do',
]

const destinations: Record<string, { name: string; type: string }[]> = {
  'Destinations for arts & culture': [
    { name: 'Phoenix', type: 'Arizona' },
    { name: 'Hot Springs', type: 'Arkansas' },
    { name: 'Los Angeles', type: 'California' },
    { name: 'San Diego', type: 'California' },
    { name: 'San Francisco', type: 'California' },
    { name: 'Barcelona', type: 'Spain' },
    { name: 'Prague', type: 'Czech Republic' },
    { name: 'Washington', type: 'D.C.' },
  ],
  'Outdoors': [
    { name: 'Lake Tahoe', type: 'California' },
    { name: 'Yosemite', type: 'California' },
    { name: 'Big Bear', type: 'California' },
    { name: 'Joshua Tree', type: 'California' },
    { name: 'Sedona', type: 'Arizona' },
    { name: 'Moab', type: 'Utah' },
    { name: 'Zion', type: 'Utah' },
    { name: 'Banff', type: 'Canada' },
  ],
  'Mountains': [
    { name: 'Aspen', type: 'Colorado' },
    { name: 'Vail', type: 'Colorado' },
    { name: 'Denver', type: 'Colorado' },
    { name: 'Park City', type: 'Utah' },
    { name: 'Jackson Hole', type: 'Wyoming' },
    { name: 'Breckenridge', type: 'Colorado' },
    { name: 'Telluride', type: 'Colorado' },
    { name: 'Lake Placid', type: 'New York' },
  ],
  'Beach': [
    { name: 'Maui', type: 'Hawaii' },
    { name: 'Miami Beach', type: 'Florida' },
    { name: 'San Juan', type: 'Puerto Rico' },
    { name: 'Punta Cana', type: 'Dominican Republic' },
    { name: 'Cabo San Lucas', type: 'Mexico' },
    { name: 'Cancun', type: 'Mexico' },
    { name: 'Myrtle Beach', type: 'South Carolina' },
    { name: 'Key West', type: 'Florida' },
  ],
  'Unique stays': [
    { name: 'Cabins', type: 'United States' },
    { name: 'Treehouses', type: 'United States' },
    { name: 'Glamping', type: 'United States' },
    { name: 'Tiny homes', type: 'United States' },
    { name: 'Beach houses', type: 'United States' },
    { name: 'Campers', type: 'United States' },
    { name: 'Lakefront', type: 'United States' },
    { name: 'Yurts', type: 'United States' },
  ],
  'Categories': [
    { name: 'Amazing pools', type: 'Homes' },
    { name: 'Arctic', type: 'Homes' },
    { name: 'Camping', type: 'Stays' },
    { name: 'Campers', type: 'Stays' },
    { name: 'Castles', type: 'Stays' },
    { name: 'Caves', type: 'Stays' },
    { name: 'Houseboats', type: 'Stays' },
    { name: 'Luxe', type: 'Stays' },
  ],
  'Things to do': [
    { name: 'London', type: 'England' },
    { name: 'Paris', type: 'France' },
    { name: 'New York', type: 'New York' },
    { name: 'Tokyo', type: 'Japan' },
    { name: 'Sydney', type: 'Australia' },
    { name: 'Rome', type: 'Italy' },
    { name: 'Amsterdam', type: 'Netherlands' },
    { name: 'Dubai', type: 'UAE' },
  ],
}

export default function InspirationTabs() {
  const [activeTab, setActiveTab] = useState(tabs[0])

  return (
    <section className="bg-[#F7F7F7] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-[#484848] mb-6">
          Inspiration for future getaways
        </h2>
        <div className="flex gap-6 overflow-x-auto pb-4 border-b border-[#EBEBEB] mb-6 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap pb-2 border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-[#484848] text-[#484848] font-medium'
                  : 'border-transparent text-[#767676] hover:text-[#484848]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
          {destinations[activeTab]?.map((dest) => (
            <a
              key={dest.name}
              href={`/search?location=${encodeURIComponent(dest.name)}`}
              className="block py-2 hover:underline"
            >
              <p className="font-medium text-[#484848]">{dest.name}</p>
              <p className="text-sm text-[#767676]">{dest.type}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
