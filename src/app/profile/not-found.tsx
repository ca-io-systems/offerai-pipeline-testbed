import { NotFoundDisplay } from '@/components/NotFoundDisplay'

export default function ProfileNotFound() {
  return (
    <div className="min-h-screen">
      <NotFoundDisplay
        title="User not found"
        message="This profile doesn't exist or may have been removed."
        suggestions={[
          { label: 'Go to homepage', href: '/' },
          { label: 'Browse listings', href: '/listings' },
        ]}
      />
    </div>
  )
}
