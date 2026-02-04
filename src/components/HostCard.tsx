import Image from 'next/image'
import type { Host } from '@/db/schema'

interface HostCardProps {
  host: Host
}

export default function HostCard({ host }: HostCardProps) {
  return (
    <div className="flex flex-col items-start gap-6 md:flex-row">
      <div className="flex items-center gap-6">
        <div className="relative h-24 w-24 overflow-hidden rounded-full">
          <Image
            src={host.avatarUrl}
            alt={host.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="text-xl font-semibold">Hosted by {host.name}</h3>
          <p className="text-[#767676]">Joined in {host.joinDate}</p>
        </div>
      </div>

      <div className="flex-1">
        <div className="mb-4 flex flex-wrap items-center gap-4">
          {host.isSuperhost && (
            <div className="flex items-center gap-2">
              <span className="text-[#FF5A5F]">★</span>
              <span>Superhost</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span>Identity verified</span>
          </div>
        </div>

        <div className="mb-4 space-y-1 text-sm">
          <p>Response rate: {host.responseRate}%</p>
          <p>Response time: {host.responseTime}</p>
        </div>

        <button className="rounded-lg border border-[#222222] px-6 py-3 font-medium hover:bg-[#F7F7F7]">
          Contact Host
        </button>
      </div>
    </div>
  )
}
