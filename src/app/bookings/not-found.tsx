import { NotFoundDisplay } from '@/components/NotFoundDisplay'

export default function BookingNotFound() {
  return (
    <div className="min-h-screen">
      <NotFoundDisplay
        title="Booking not found"
        message="This booking doesn't exist or you don't have permission to view it."
        suggestions={[
          { label: 'View your bookings', href: '/bookings' },
          { label: 'Go to homepage', href: '/' },
        ]}
      />
    </div>
  )
}
