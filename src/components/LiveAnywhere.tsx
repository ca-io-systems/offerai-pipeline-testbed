import Image from 'next/image'

const propertyTypes = [
  { name: 'Outdoor getaways', image: 'https://picsum.photos/seed/outdoor/500/600' },
  { name: 'Unique stays', image: 'https://picsum.photos/seed/unique/500/600' },
  { name: 'Entire homes', image: 'https://picsum.photos/seed/homes/500/600' },
  { name: 'Pet allowed', image: 'https://picsum.photos/seed/pets/500/600' },
]

export default function LiveAnywhere() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold text-[#484848] mb-6">Live anywhere</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {propertyTypes.map((type) => (
          <a
            key={type.name}
            href={`/search?type=${encodeURIComponent(type.name)}`}
            className="block group"
          >
            <div className="relative aspect-[5/6] rounded-xl overflow-hidden mb-3">
              <Image
                src={type.image}
                alt={type.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="font-medium text-[#484848]">{type.name}</h3>
          </a>
        ))}
      </div>
    </section>
  )
}
