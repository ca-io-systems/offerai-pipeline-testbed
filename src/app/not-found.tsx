import type { Metadata } from 'next'
import { JsonLd, generateBreadcrumbSchema } from '@/components/JsonLd'
import { SITE_NAME, SITE_URL } from '@/lib/constants'
import { getCategories } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for could not be found.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function NotFoundPage() {
  const categories = getCategories()

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: SITE_URL },
    { name: '404', url: `${SITE_URL}/404` },
  ])

  return (
    <>
      <JsonLd data={breadcrumbSchema} />

      <div className="py-12 text-center">
        <h1 className="text-6xl font-bold text-[#FF5A5F]">404</h1>
        <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>
        <p className="mt-2 text-[#767676]">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="mt-8">
          <a
            href="/"
            className="inline-block rounded-lg bg-[#FF5A5F] px-6 py-3 font-medium text-white hover:bg-[#E04E53] transition-colors"
          >
            Go to Homepage
          </a>
        </div>

        <div className="mx-auto mt-12 max-w-2xl text-left">
          <h3 className="text-lg font-semibold">Looking for something?</h3>
          <p className="mt-2 text-[#767676]">
            Try searching for a destination or browse our categories:
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {categories.map((category) => (
              <a
                key={category.id}
                href={`/category/${category.slug}`}
                className="block rounded-lg border border-[#EBEBEB] p-4 hover:border-[#FF5A5F] transition-colors"
              >
                <span className="font-medium">{category.name}</span>
                <p className="mt-1 text-sm text-[#767676]">{category.description}</p>
              </a>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold">Popular destinations</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              <a
                href="/search?q=new+york"
                className="rounded-full bg-[#F7F7F7] px-4 py-2 text-sm hover:bg-[#EBEBEB] transition-colors"
              >
                New York
              </a>
              <a
                href="/search?q=miami"
                className="rounded-full bg-[#F7F7F7] px-4 py-2 text-sm hover:bg-[#EBEBEB] transition-colors"
              >
                Miami
              </a>
              <a
                href="/search?q=denver"
                className="rounded-full bg-[#F7F7F7] px-4 py-2 text-sm hover:bg-[#EBEBEB] transition-colors"
              >
                Denver
              </a>
              <a
                href="/search?q=los+angeles"
                className="rounded-full bg-[#F7F7F7] px-4 py-2 text-sm hover:bg-[#EBEBEB] transition-colors"
              >
                Los Angeles
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
