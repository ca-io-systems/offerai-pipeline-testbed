'use client'

import { useRouter } from 'next/navigation'
import { updateUserRole, suspendUser, deleteUser, resetUserPassword } from '@/actions/users'

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

type UserSlideOverProps = {
  user: User
  onClose: () => void
}

export function UserSlideOver({ user, onClose }: UserSlideOverProps) {
  const router = useRouter()

  const handleMakeAdmin = async () => {
    await updateUserRole(user.id, true)
    router.refresh()
    onClose()
  }

  const handleRemoveAdmin = async () => {
    await updateUserRole(user.id, false)
    router.refresh()
    onClose()
  }

  const handleSuspend = async () => {
    await suspendUser(user.id, !user.isSuspended)
    router.refresh()
    onClose()
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      await deleteUser(user.id)
      router.refresh()
      onClose()
    }
  }

  const handleResetPassword = async () => {
    await resetUserPassword(user.id)
    alert('Password reset email sent (simulated)')
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-lg w-full bg-white shadow-xl">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#EBEBEB] flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#484848]">User Profile</h2>
            <button
              onClick={onClose}
              className="text-[#767676] hover:text-[#484848]"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Avatar and Name */}
            <div className="flex items-center gap-4 mb-6">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#FF5A5F] flex items-center justify-center text-white text-2xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="text-2xl font-bold text-[#484848]">{user.name}</h3>
                <p className="text-[#767676]">{user.email}</p>
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex gap-2 mb-6">
              {user.isAdmin && (
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-[#FF5A5F] text-white uppercase">
                  Admin
                </span>
              )}
              {user.isSuspended ? (
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-[#C13515] text-white uppercase">
                  Suspended
                </span>
              ) : (
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-[#008A05] text-white uppercase">
                  Active
                </span>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-[#F7F7F7] rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-[#484848]">{user.listingsCount}</p>
                <p className="text-sm text-[#767676]">Listings</p>
              </div>
              <div className="bg-[#F7F7F7] rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-[#484848]">{user.bookingsCount}</p>
                <p className="text-sm text-[#767676]">Bookings</p>
              </div>
              <div className="bg-[#F7F7F7] rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-[#484848]">
                  {Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                </p>
                <p className="text-sm text-[#767676]">Days</p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[#767676]">Member Since</p>
                <p className="text-[#484848]">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 border-t border-[#EBEBEB] space-y-3">
            {/* Admin Toggle */}
            {user.isAdmin ? (
              <button
                onClick={handleRemoveAdmin}
                className="w-full px-4 py-2 border border-[#767676] text-[#767676] rounded-md hover:bg-[#767676] hover:text-white transition-colors"
              >
                Remove Admin Role
              </button>
            ) : (
              <button
                onClick={handleMakeAdmin}
                className="w-full px-4 py-2 bg-[#FF5A5F] text-white rounded-md hover:bg-[#E04E52] transition-colors"
              >
                Make Admin
              </button>
            )}

            {/* Suspend Toggle */}
            <button
              onClick={handleSuspend}
              className={`w-full px-4 py-2 rounded-md transition-colors ${
                user.isSuspended
                  ? 'bg-[#008A05] text-white hover:bg-[#007004]'
                  : 'bg-[#FFB400] text-white hover:bg-[#E0A000]'
              }`}
            >
              {user.isSuspended ? 'Unsuspend User' : 'Suspend User'}
            </button>

            {/* Reset Password */}
            <button
              onClick={handleResetPassword}
              className="w-full px-4 py-2 border border-[#EBEBEB] text-[#484848] rounded-md hover:bg-[#F7F7F7] transition-colors"
            >
              Reset Password
            </button>

            {/* Delete */}
            <button
              onClick={handleDelete}
              className="w-full px-4 py-2 border border-[#C13515] text-[#C13515] rounded-md hover:bg-[#C13515] hover:text-white transition-colors"
            >
              Delete User
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
