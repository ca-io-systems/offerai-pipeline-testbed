import { NotFoundDisplay } from '@/components/NotFoundDisplay'

export default function ListingNotFound() {
  return (
    <div className="min-h-screen">
      <NotFoundDisplay
        title="Listing not found"
        message="This listing may have been removed or is no longer available. Check out other great places to stay."
        suggestions={[
          { label: 'Browse listings', href: '/listings' },
          { label: 'Search', href: '/search' },
        ]}
      />
    </div>
  )
}
