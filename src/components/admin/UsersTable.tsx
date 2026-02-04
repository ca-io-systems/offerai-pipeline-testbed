'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserSlideOver } from './UserSlideOver'

type User = {
  id: number
  name: string
  email: string
  avatarUrl: string | null
  isAdmin: boolean
  isSuspended: boolean
  createdAt: Date
  listingsCount: number
  bookingsCount: number
}

type UsersTableProps = {
  users: User[]
  initialSearch?: string
}

export function UsersTable({ users, initialSearch = '' }: UsersTableProps) {
  const router = useRouter()
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [search, setSearch] = useState(initialSearch)

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    router.push(`/admin/users?${params.toString()}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <>
      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-[#EBEBEB] p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search by name or email..."
              className="w-full px-3 py-2 border border-[#EBEBEB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF5A5F] focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-[#FF5A5F] text-white rounded-md hover:bg-[#E04E52] transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-[#EBEBEB] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#F7F7F7] border-b border-[#EBEBEB]">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#484848]">User</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#484848]">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#484848]">Joined</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#484848]">Listings</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#484848]">Bookings</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#484848]">Role</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#484848]">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className={`border-b border-[#EBEBEB] hover:bg-[#F7F7F7] cursor-pointer ${user.isSuspended ? 'bg-red-50' : ''}`}
                onClick={() => setSelectedUser(user)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#FF5A5F] flex items-center justify-center text-white text-sm font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm font-medium text-[#484848]">{user.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-[#767676]">{user.email}</td>
                <td className="px-4 py-3 text-sm text-[#767676]">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm text-[#484848]">{user.listingsCount}</td>
                <td className="px-4 py-3 text-sm text-[#484848]">{user.bookingsCount}</td>
                <td className="px-4 py-3">
                  {user.isAdmin ? (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-[#FF5A5F] text-white uppercase">
                      Admin
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-[#767676] text-white uppercase">
                      User
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {user.isSuspended ? (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-[#C13515] text-white uppercase">
                      Suspended
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-[#008A05] text-white uppercase">
                      Active
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="p-8 text-center text-[#767676]">
            No users found matching your search.
          </div>
        )}
      </div>

      {/* Slide Over */}
      {selectedUser && (
        <UserSlideOver
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </>
  )
}
