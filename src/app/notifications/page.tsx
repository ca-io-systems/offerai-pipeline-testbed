import { getNotifications } from '@/actions/notifications'
import { notificationTypes, type NotificationType } from '@/db/schema'
import { NotificationsList } from './NotificationsList'

type SearchParams = Promise<{
  page?: string
  type?: string
}>

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const page = parseInt(params.page ?? '1', 10)
  const type = params.type as NotificationType | undefined
  const limit = 10
  const offset = (page - 1) * limit

  const validType = type && notificationTypes.includes(type) ? type : undefined

  const { notifications, total, unreadCount } = await getNotifications({
    limit,
    offset,
    type: validType,
  })

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      <NotificationsList
        notifications={notifications}
        total={total}
        page={page}
        totalPages={totalPages}
        currentType={validType}
        unreadCount={unreadCount}
      />
    </div>
  )
}
