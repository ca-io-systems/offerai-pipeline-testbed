import Image from 'next/image'

export default function TryHostingBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
        <Image
          src="https://picsum.photos/seed/hosting/1600/800"
          alt="Try hosting"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Try hosting
          </h2>
          <p className="text-white/90 text-lg mb-6 max-w-md">
            Earn extra income and unlock new opportunities by sharing your space.
          </p>
          <a
            href="/host"
            className="inline-block bg-white text-[#484848] font-semibold px-6 py-3 rounded-lg hover:bg-[#F7F7F7] transition-colors w-fit"
          >
            Learn more
          </a>
        </div>
      </div>
    </section>
  )
}
