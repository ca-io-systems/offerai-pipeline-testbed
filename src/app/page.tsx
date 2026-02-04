import Link from 'next/link'
import Image from 'next/image'
import { db } from '@/db'
import { users } from '@/db/schema'

export default async function Home() {
  const allUsers = await db.select().from(users).limit(10)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-[#484848] mb-8">Welcome to OfferBnb</h1>
      
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-[#484848] mb-4">Browse User Profiles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allUsers.map((user) => (
            <Link
              key={user.id}
              href={`/users/${user.id}`}
              className="block p-4 border border-[#EBEBEB] rounded-xl hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                {user.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#FF5A5F] flex items-center justify-center text-white font-semibold">
                    {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-[#484848]">{user.name}</h3>
                  <p className="text-sm text-[#767676]">{user.location || 'Location not set'}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#484848] mb-4">Quick Links</h2>
        <div className="flex gap-4">
          <Link
            href="/dashboard/profile"
            className="px-6 py-3 bg-[#FF5A5F] text-white rounded-lg font-medium hover:bg-[#E04E52] transition-colors"
          >
            Edit Your Profile
          </Link>
        </div>
      </section>
    </div>
  )
}
