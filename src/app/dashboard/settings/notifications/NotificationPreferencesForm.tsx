'use client'

import { useState } from 'react'
import {
  updateNotificationPreferences,
  type NotificationPreferencesData,
} from '@/actions/notifications'

const preferenceGroups = [
  {
    id: 'bookingConfirmed',
    title: 'Booking Confirmed',
    description: 'When your booking is confirmed by a host',
  },
  {
    id: 'bookingRequest',
    title: 'Booking Request',
    description: 'When a guest requests to book your listing',
  },
  {
    id: 'bookingCancelled',
    title: 'Booking Cancelled',
    description: 'When a booking is cancelled',
  },
  {
    id: 'reviewReceived',
    title: 'Review Received',
    description: 'When someone leaves you a review',
  },
  {
    id: 'messageReceived',
    title: 'Message Received',
    description: 'When you receive a new message',
  },
  {
    id: 'listingPublished',
    title: 'Listing Published',
    description: 'When your listing goes live',
  },
  {
    id: 'priceChange',
    title: 'Price Change',
    description: 'When your listing price is updated',
  },
] as const

type PreferenceGroupId = typeof preferenceGroups[number]['id']

type NotificationPreferencesFormProps = {
  initialPreferences: NotificationPreferencesData
}

export function NotificationPreferencesForm({
  initialPreferences,
}: NotificationPreferencesFormProps) {
  const [preferences, setPreferences] = useState(initialPreferences)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const getInAppKey = (id: PreferenceGroupId): keyof NotificationPreferencesData => {
    return `${id}InApp` as keyof NotificationPreferencesData
  }

  const getEmailKey = (id: PreferenceGroupId): keyof NotificationPreferencesData => {
    return `${id}Email` as keyof NotificationPreferencesData
  }

  const handleToggle = async (
    key: keyof NotificationPreferencesData,
    value: boolean
  ) => {
    const newPreferences = { ...preferences, [key]: value }
    setPreferences(newPreferences)
    setSaved(false)
    setSaving(true)

    try {
      await updateNotificationPreferences({ [key]: value })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium text-gray-900">Notification Type</div>
            <div className="font-medium text-gray-900 text-center">In-App</div>
            <div className="font-medium text-gray-900 text-center">Email</div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {preferenceGroups.map(group => {
            const inAppKey = getInAppKey(group.id)
            const emailKey = getEmailKey(group.id)

            return (
              <div key={group.id} className="p-4">
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div>
                    <p className="font-medium text-gray-900">{group.title}</p>
                    <p className="text-sm text-gray-500">{group.description}</p>
                  </div>
                  <div className="flex justify-center">
                    <ToggleSwitch
                      checked={preferences[inAppKey]}
                      onChange={value => handleToggle(inAppKey, value)}
                      label={`${group.title} in-app notifications`}
                    />
                  </div>
                  <div className="flex justify-center">
                    <ToggleSwitch
                      checked={preferences[emailKey]}
                      onChange={value => handleToggle(emailKey, value)}
                      label={`${group.title} email notifications`}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm">
        {saving && <span className="text-gray-500">Saving...</span>}
        {saved && <span className="text-green-600">Preferences saved!</span>}
      </div>

      <p className="text-sm text-gray-500">
        Note: Email notifications are currently in preview mode and won&apos;t send
        actual emails.
      </p>
    </div>
  )
}

function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (value: boolean) => void
  label: string
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-[#FF5A5F]' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}
