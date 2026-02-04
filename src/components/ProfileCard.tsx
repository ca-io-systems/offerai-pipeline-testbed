import Link from 'next/link'
import Image from 'next/image'
import type { User } from '@/db/schema'

interface ProfileCardProps {
  user: User
  showBio?: boolean
  showVerificationBadges?: boolean
  showResponseInfo?: boolean
  linkToProfile?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const avatarPixelSizes = {
  sm: 40,
  md: 56,
  lg: 80,
}

export default function ProfileCard({
  user,
  showBio = false,
  showVerificationBadges = false,
  showResponseInfo = false,
  linkToProfile = true,
  size = 'md',
}: ProfileCardProps) {
  const avatarSizes = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-lg',
    lg: 'w-20 h-20 text-2xl',
  }

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const joinedYear = user.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear()

  const content = (
    <div className="flex items-start gap-4">
      {user.avatarUrl ? (
        <Image
          src={user.avatarUrl}
          alt={user.name}
          width={avatarPixelSizes[size]}
          height={avatarPixelSizes[size]}
          className={`${avatarSizes[size]} rounded-full object-cover flex-shrink-0`}
        />
      ) : (
        <div
          className={`${avatarSizes[size]} rounded-full bg-[#FF5A5F] flex items-center justify-center text-white font-semibold flex-shrink-0`}
        >
          {initials}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-[#484848] truncate">{user.name}</h3>
        <p className="text-sm text-[#767676]">Joined in {joinedYear}</p>

        {showVerificationBadges && (
          <div className="flex flex-wrap gap-2 mt-2">
            {user.emailVerified && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#F7F7F7] rounded-full text-xs text-[#484848]">
                <svg className="w-3 h-3 text-[#008A05]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                EMAIL VERIFIED
              </span>
            )}
            {user.phoneVerified && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#F7F7F7] rounded-full text-xs text-[#484848]">
                <svg className="w-3 h-3 text-[#008A05]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                PHONE VERIFIED
              </span>
            )}
            {user.idVerified && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#F7F7F7] rounded-full text-xs text-[#484848]">
                <svg className="w-3 h-3 text-[#008A05]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                ID VERIFIED
              </span>
            )}
          </div>
        )}

        {showBio && user.bio && (
          <p className="mt-2 text-sm text-[#484848] line-clamp-2">{user.bio}</p>
        )}

        {showResponseInfo && (
          <div className="mt-2 text-sm text-[#767676]">
            <p>Response rate: {user.responseRate}%</p>
            <p>Responds {user.responseTime}</p>
          </div>
        )}
      </div>
    </div>
  )

  if (linkToProfile) {
    return (
      <Link
        href={`/users/${user.id}`}
        className="block p-4 border border-[#EBEBEB] rounded-xl hover:shadow-md transition-shadow"
      >
        {content}
      </Link>
    )
  }

  return <div className="p-4 border border-[#EBEBEB] rounded-xl">{content}</div>
}
