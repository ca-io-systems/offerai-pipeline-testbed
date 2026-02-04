import { notFound } from 'next/navigation'
import Image from 'next/image'
import { db } from '@/db'
import { users, listings, reviews } from '@/db/schema'
import { eq, and, avg, count } from 'drizzle-orm'
import ListingCard from '@/components/ListingCard'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function UserProfilePage({ params }: PageProps) {
  const { id } = await params
  const userId = parseInt(id, 10)

  if (isNaN(userId)) {
    notFound()
  }

  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1)

  if (!user) {
    notFound()
  }

  // Get user's listings (if host)
  const userListings = await db.select().from(listings).where(eq(listings.hostId, userId))

  // Calculate if superhost (avg rating > 4.8 and 10+ reviews on their listings)
  const hostReviewStats = await db
    .select({
      avgRating: avg(reviews.rating),
      totalReviews: count(reviews.id),
    })
    .from(reviews)
    .innerJoin(listings, eq(reviews.listingId, listings.id))
    .where(and(eq(listings.hostId, userId), eq(reviews.type, 'guest_to_host')))

  const avgRating = hostReviewStats[0]?.avgRating ? Number(hostReviewStats[0].avgRating) : 0
  const totalHostReviews = hostReviewStats[0]?.totalReviews ?? 0
  const isSuperhost = avgRating > 4.8 && totalHostReviews >= 10

  // Get reviews written by this user
  const reviewsWritten = await db
    .select({
      review: reviews,
      targetUser: users,
    })
    .from(reviews)
    .innerJoin(users, eq(reviews.targetUserId, users.id))
    .where(eq(reviews.authorId, userId))

  // Get reviews about this user
  const reviewsReceived = await db
    .select({
      review: reviews,
      author: users,
    })
    .from(reviews)
    .innerJoin(users, eq(reviews.authorId, users.id))
    .where(eq(reviews.targetUserId, userId))

  const isHost = userListings.length > 0
  const joinedYear = user.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear()

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="flex-shrink-0">
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.name}
              width={160}
              height={160}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover"
            />
          ) : (
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#FF5A5F] flex items-center justify-center text-white text-4xl md:text-5xl font-semibold">
              {initials}
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <h1 className="text-3xl font-bold text-[#484848]">{user.name}</h1>
            {isHost && isSuperhost && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#FF5A5F] text-white rounded-full text-sm font-medium">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                </svg>
                SUPERHOST
              </span>
            )}
          </div>
          <p className="text-[#767676] mb-4">Joined in {joinedYear}</p>

          {/* Verification Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {user.emailVerified && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#F7F7F7] rounded-full text-sm text-[#484848]">
                <svg className="w-4 h-4 text-[#008A05]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                EMAIL VERIFIED
              </span>
            )}
            {user.phoneVerified && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#F7F7F7] rounded-full text-sm text-[#484848]">
                <svg className="w-4 h-4 text-[#008A05]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                PHONE VERIFIED
              </span>
            )}
            {user.idVerified && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#F7F7F7] rounded-full text-sm text-[#484848]">
                <svg className="w-4 h-4 text-[#008A05]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                ID VERIFIED
              </span>
            )}
          </div>

          {user.bio && <p className="text-[#484848] mb-4">{user.bio}</p>}
          {user.location && (
            <p className="flex items-center gap-2 text-[#767676]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {user.location}
            </p>
          )}
        </div>
      </div>

      {/* Host Section */}
      {isHost && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#484848] mb-6">Host Information</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="p-4 bg-[#F7F7F7] rounded-xl text-center">
              <p className="text-2xl font-bold text-[#484848]">{userListings.length}</p>
              <p className="text-sm text-[#767676]">Listings</p>
            </div>
            <div className="p-4 bg-[#F7F7F7] rounded-xl text-center">
              <p className="text-2xl font-bold text-[#484848]">{totalHostReviews}</p>
              <p className="text-sm text-[#767676]">Reviews</p>
            </div>
            <div className="p-4 bg-[#F7F7F7] rounded-xl text-center">
              <p className="text-2xl font-bold text-[#484848]">{user.responseRate}%</p>
              <p className="text-sm text-[#767676]">Response rate</p>
            </div>
            <div className="p-4 bg-[#F7F7F7] rounded-xl text-center">
              <p className="text-lg font-bold text-[#484848] capitalize">{user.responseTime}</p>
              <p className="text-sm text-[#767676]">Response time</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-[#484848] mb-4">{user.name}&apos;s Listings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} showSuperhost={isSuperhost} />
            ))}
          </div>
        </section>
      )}

      {/* Guest Stats */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-[#484848] mb-6">Guest Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-[#F7F7F7] rounded-xl text-center">
            <p className="text-2xl font-bold text-[#484848]">{reviewsWritten.length}</p>
            <p className="text-sm text-[#767676]">Reviews written</p>
          </div>
          <div className="p-4 bg-[#F7F7F7] rounded-xl text-center">
            <p className="text-2xl font-bold text-[#484848]">{reviewsReceived.length}</p>
            <p className="text-sm text-[#767676]">Reviews received</p>
          </div>
        </div>
      </section>

      {/* Reviews Tab Section */}
      <section>
        <h2 className="text-2xl font-bold text-[#484848] mb-6">Reviews</h2>

        {/* Reviews Written */}
        {reviewsWritten.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[#484848] mb-4">Reviews by {user.name}</h3>
            <div className="space-y-4">
              {reviewsWritten.map(({ review, targetUser }) => (
                <div key={review.id} className="p-4 border border-[#EBEBEB] rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? 'text-[#FF5A5F]' : 'text-[#EBEBEB]'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-[#767676]">
                      About {targetUser.name}
                    </span>
                  </div>
                  {review.text && <p className="text-[#484848]">{review.text}</p>}
                  <p className="text-sm text-[#767676] mt-2">
                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Received */}
        {reviewsReceived.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-[#484848] mb-4">Reviews about {user.name}</h3>
            <div className="space-y-4">
              {reviewsReceived.map(({ review, author }) => (
                <div key={review.id} className="p-4 border border-[#EBEBEB] rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    {author.avatarUrl ? (
                      <Image
                        src={author.avatarUrl}
                        alt={author.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#FF5A5F] flex items-center justify-center text-white text-sm font-semibold">
                        {author.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-[#484848]">{author.name}</p>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-3 h-3 ${i < review.rating ? 'text-[#FF5A5F]' : 'text-[#EBEBEB]'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  {review.text && <p className="text-[#484848]">{review.text}</p>}
                  <p className="text-sm text-[#767676] mt-2">
                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {reviewsWritten.length === 0 && reviewsReceived.length === 0 && (
          <p className="text-[#767676] text-center py-8">No reviews yet</p>
        )}
      </section>
    </div>
  )
}
