import Image from 'next/image'
import type { Host } from '@/db/schema'

interface HostInfoProps {
  host: Host
}

export default function HostInfo({ host }: HostInfoProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-12 w-12 overflow-hidden rounded-full">
        <Image
          src={host.avatarUrl}
          alt={host.name}
          fill
          className="object-cover"
        />
      </div>
      <div>
        <p className="font-medium">Hosted by {host.name}</p>
        {host.isSuperhost && (
          <span className="inline-flex items-center gap-1 text-sm text-[#767676]">
            <span className="text-[#FF5A5F]">★</span>
            Superhost
          </span>
        )}
      </div>
    </div>
  )
}
