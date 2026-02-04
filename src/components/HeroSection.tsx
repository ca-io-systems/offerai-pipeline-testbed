import Image from 'next/image'
import SearchBar from './SearchBar'

export default function HeroSection() {
  return (
    <section className="relative h-[500px] md:h-[600px] w-full">
      <Image
        src="https://picsum.photos/1920/800"
        alt="Find your next adventure"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-8">
          Find your next adventure
        </h1>
        <SearchBar />
      </div>
    </section>
  )
}
