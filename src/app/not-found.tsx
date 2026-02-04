import { NotFoundDisplay } from '@/components/NotFoundDisplay'

export default function NotFound() {
  return (
    <main className="min-h-screen">
      <NotFoundDisplay
        title="Page not found"
        message="The page you're looking for doesn't exist or has been moved."
        suggestions={[
          { label: 'Go to homepage', href: '/' },
          { label: 'Browse listings', href: '/listings' },
        ]}
      />
    </main>
  )
}
