'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SwipeableGallery } from '@/components/SwipeableGallery'

const mockListing = {
  id: '1',
  title: 'Cozy apartment with ocean view',
  location: 'Malibu, California, United States',
  description: 'Wake up to stunning ocean views in this beautifully designed apartment. Perfect for couples or solo travelers looking for a peaceful retreat by the sea. The space features modern amenities, a fully equipped kitchen, and a private balcony overlooking the Pacific Ocean.',
  price: 250,
  rating: 4.92,
  reviewCount: 128,
  guests: 2,
  bedrooms: 1,
  beds: 1,
  bathrooms: 1,
  images: [
    'https://picsum.photos/seed/detail1/1200/800',
    'https://picsum.photos/seed/detail2/1200/800',
    'https://picsum.photos/seed/detail3/1200/800',
    'https://picsum.photos/seed/detail4/1200/800',
    'https://picsum.photos/seed/detail5/1200/800',
    'https://picsum.photos/seed/detail6/1200/800',
    'https://picsum.photos/seed/detail7/1200/800',
    'https://picsum.photos/seed/detail8/1200/800',
    'https://picsum.photos/seed/detail9/1200/800',
    'https://picsum.photos/seed/detail10/1200/800',
    'https://picsum.photos/seed/detail11/1200/800',
    'https://picsum.photos/seed/detail12/1200/800',
  ],
  host: {
    name: 'Sarah',
    image: 'https://picsum.photos/seed/host1/100/100',
    superhost: true,
    yearsHosting: 5,
  },
  amenities: [
    'Wifi',
    'Kitchen',
    'Free parking',
    'Air conditioning',
    'Washer',
    'Dryer',
    'TV',
    'Pool',
  ],
}

export default function ListingDetailPage() {
  const [showAllPhotos, setShowAllPhotos] = useState(false)

  return (
    <div className="pb-24 md:pb-8">
      {/* Mobile Back Button */}
      <div className="md:hidden sticky top-0 z-30 bg-white border-b border-[#EBEBEB]">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="touch-target flex items-center justify-center">
            <svg className="w-6 h-6 text-[#484848]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex items-center gap-4">
            <button className="touch-target flex items-center justify-center">
              <svg className="w-6 h-6 text-[#484848]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
            <button className="touch-target flex items-center justify-center">
              <svg className="w-6 h-6 text-[#484848]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Gallery */}
      <div className="md:hidden">
        <SwipeableGallery images={mockListing.images} alt={mockListing.title} />
      </div>

      {/* Desktop Gallery Grid */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-xl overflow-hidden h-[400px]">
          <div className="col-span-2 row-span-2 relative">
            <Image
              src={mockListing.images[0]}
              alt={mockListing.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          {mockListing.images.slice(1, 5).map((image, index) => (
            <div key={index} className="relative">
              <Image
                src={image}
                alt={`${mockListing.title} - ${index + 2}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
          <button
            onClick={() => setShowAllPhotos(true)}
            className="absolute bottom-4 right-4 px-4 py-2 bg-white rounded-lg border border-[#484848] text-sm font-medium text-[#484848] hover:bg-[#F7F7F7] transition-colors"
          >
            Show all photos
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:grid md:grid-cols-3 md:gap-12 mt-6">
          {/* Main Content - Single column on mobile */}
          <div className="md:col-span-2">
            <h1 className="text-2xl md:text-3xl font-semibold text-[#484848]">
              {mockListing.title}
            </h1>
            <p className="text-[#484848] mt-1">{mockListing.location}</p>
            
            <div className="flex items-center gap-2 mt-2 text-sm text-[#484848]">
              <span>{mockListing.guests} guests</span>
              <span>·</span>
              <span>{mockListing.bedrooms} bedroom</span>
              <span>·</span>
              <span>{mockListing.beds} bed</span>
              <span>·</span>
              <span>{mockListing.bathrooms} bath</span>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <svg className="w-4 h-4 text-[#484848]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="font-medium text-[#484848]">{mockListing.rating}</span>
              <span className="text-[#767676]">·</span>
              <button className="text-[#484848] underline">
                {mockListing.reviewCount} reviews
              </button>
            </div>

            <hr className="my-6 border-[#EBEBEB]" />

            {/* Host Info */}
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 flex-shrink-0">
                <Image
                  src={mockListing.host.image}
                  alt={mockListing.host.name}
                  fill
                  className="rounded-full object-cover"
                />
                {mockListing.host.superhost && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#FF5A5F] rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium text-[#484848]">Hosted by {mockListing.host.name}</p>
                <p className="text-sm text-[#767676]">
                  {mockListing.host.superhost && 'Superhost · '}
                  {mockListing.host.yearsHosting} years hosting
                </p>
              </div>
            </div>

            <hr className="my-6 border-[#EBEBEB]" />

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-[#484848] mb-4">About this place</h2>
              <p className="text-[#484848] leading-relaxed">{mockListing.description}</p>
            </div>

            <hr className="my-6 border-[#EBEBEB]" />

            {/* Amenities */}
            <div>
              <h2 className="text-xl font-semibold text-[#484848] mb-4">What this place offers</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mockListing.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-4">
                    <svg className="w-6 h-6 text-[#484848]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-[#484848]">{amenity}</span>
                  </div>
                ))}
              </div>
              <button className="mt-6 px-6 py-3 border border-[#484848] rounded-lg text-[#484848] font-medium hover:bg-[#F7F7F7] transition-colors">
                Show all amenities
              </button>
            </div>
          </div>

          {/* Desktop Booking Card */}
          <div className="hidden md:block">
            <div className="sticky top-24 border border-[#EBEBEB] rounded-xl p-6 shadow-lg">
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-2xl font-semibold text-[#484848]">${mockListing.price}</span>
                <span className="text-[#484848]">night</span>
              </div>

              <div className="border border-[#EBEBEB] rounded-lg overflow-hidden mb-4">
                <div className="grid grid-cols-2">
                  <div className="p-3 border-r border-b border-[#EBEBEB]">
                    <label className="text-xs font-semibold text-[#484848] uppercase">Check-in</label>
                    <input type="text" placeholder="Add date" className="w-full mt-1 text-sm text-[#484848] placeholder-[#767676] focus:outline-none" />
                  </div>
                  <div className="p-3 border-b border-[#EBEBEB]">
                    <label className="text-xs font-semibold text-[#484848] uppercase">Checkout</label>
                    <input type="text" placeholder="Add date" className="w-full mt-1 text-sm text-[#484848] placeholder-[#767676] focus:outline-none" />
                  </div>
                </div>
                <div className="p-3">
                  <label className="text-xs font-semibold text-[#484848] uppercase">Guests</label>
                  <select className="w-full mt-1 text-sm text-[#484848] focus:outline-none bg-transparent">
                    <option>1 guest</option>
                    <option>2 guests</option>
                    <option>3 guests</option>
                    <option>4 guests</option>
                  </select>
                </div>
              </div>

              <button className="w-full py-3 bg-[#FF5A5F] text-white font-semibold rounded-lg hover:bg-[#E04E52] transition-colors">
                Reserve
              </button>

              <p className="text-center text-sm text-[#767676] mt-4">You won&apos;t be charged yet</p>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#484848] underline">${mockListing.price} x 5 nights</span>
                  <span className="text-[#484848]">${mockListing.price * 5}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#484848] underline">Cleaning fee</span>
                  <span className="text-[#484848]">$75</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#484848] underline">Service fee</span>
                  <span className="text-[#484848]">$125</span>
                </div>
                <hr className="border-[#EBEBEB]" />
                <div className="flex justify-between font-semibold">
                  <span className="text-[#484848]">Total before taxes</span>
                  <span className="text-[#484848]">${mockListing.price * 5 + 75 + 125}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 bg-white border-t border-[#EBEBEB] px-4 py-3 z-40">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-semibold text-[#484848]">${mockListing.price}</span>
              <span className="text-[#484848]">night</span>
            </div>
            <button className="text-sm text-[#484848] underline">Dec 15-20</button>
          </div>
          <button className="px-6 py-3 bg-[#FF5A5F] text-white font-semibold rounded-lg hover:bg-[#E04E52] transition-colors">
            Reserve
          </button>
        </div>
      </div>
    </div>
  )
}
