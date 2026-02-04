import Image from 'next/image'

const cities = [
  { name: 'Los Angeles', distance: '45 minute drive', image: 'https://picsum.photos/seed/la/300/300' },
  { name: 'Miami', distance: '4.5 hour drive', image: 'https://picsum.photos/seed/miami/300/300' },
  { name: 'New York', distance: '30 minute drive', image: 'https://picsum.photos/seed/ny/300/300' },
  { name: 'San Francisco', distance: '1 hour drive', image: 'https://picsum.photos/seed/sf/300/300' },
  { name: 'Las Vegas', distance: '3.5 hour drive', image: 'https://picsum.photos/seed/vegas/300/300' },
  { name: 'San Diego', distance: '2 hour drive', image: 'https://picsum.photos/seed/sd/300/300' },
]

export default function ExploreNearby() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold text-[#484848] mb-6">Explore nearby</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {cities.map((city) => (
          <a
            key={city.name}
            href={`/search?location=${encodeURIComponent(city.name)}`}
            className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#F7F7F7] transition-colors"
          >
            <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
              <Image
                src={city.image}
                alt={city.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium text-[#484848]">{city.name}</h3>
              <p className="text-sm text-[#767676]">{city.distance}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
