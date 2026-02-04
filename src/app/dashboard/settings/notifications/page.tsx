import { getNotificationPreferences } from '@/actions/notifications'
import { NotificationPreferencesForm } from './NotificationPreferencesForm'

export default async function NotificationPreferencesPage() {
  const preferences = await getNotificationPreferences()

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Notification Preferences
      </h1>
      <p className="text-gray-600 mb-8">
        Choose how you want to be notified about activity on OfferBnb.
      </p>

      <NotificationPreferencesForm initialPreferences={preferences} />
    </div>
  )
}
