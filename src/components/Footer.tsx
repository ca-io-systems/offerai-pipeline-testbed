import Container from './Container'

const footerLinks = {
  support: {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '/help' },
      { label: 'AirCover', href: '/aircover' },
      { label: 'Anti-discrimination', href: '/against-discrimination' },
      { label: 'Disability support', href: '/accessibility' },
      { label: 'Cancellation options', href: '/help/cancellation' },
      { label: 'Report neighborhood concern', href: '/neighbors' },
    ],
  },
  hosting: {
    title: 'Hosting',
    links: [
      { label: 'OfferBnb your home', href: '/host/homes' },
      { label: 'AirCover for Hosts', href: '/aircover-for-hosts' },
      { label: 'Hosting resources', href: '/resources' },
      { label: 'Community forum', href: '/community' },
      { label: 'Hosting responsibly', href: '/responsible-hosting' },
      { label: 'OfferBnb-friendly apartments', href: '/apartments' },
    ],
  },
  offerbnb: {
    title: 'OfferBnb',
    links: [
      { label: 'Newsroom', href: '/press/news' },
      { label: 'New features', href: '/feature' },
      { label: 'Careers', href: '/careers' },
      { label: 'Investors', href: '/investors' },
      { label: 'Gift cards', href: '/giftcards' },
      { label: 'Emergency stays', href: '/emergency' },
    ],
  },
  inspiration: {
    title: 'Inspiration',
    links: [
      { label: 'Canmore', href: '/canmore-canada' },
      { label: 'Benalmádena', href: '/benalmadena-spain' },
      { label: 'Marbella', href: '/marbella-spain' },
      { label: 'Mijas', href: '/mijas-spain' },
      { label: 'Prescott', href: '/prescott-us' },
      { label: 'Scottsdale', href: '/scottsdale-us' },
    ],
  },
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="hidden md:block border-t border-[#EBEBEB] bg-[#F7F7F7]">
      <Container>
        <div className="grid grid-cols-1 gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-sm font-semibold text-[#484848]">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-[#484848] hover:underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[#EBEBEB] py-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex flex-wrap items-center gap-2 text-sm text-[#484848]">
              <span>© {currentYear} OfferBnb, Inc.</span>
              <span>·</span>
              <a href="/privacy" className="hover:underline">
                Privacy
              </a>
              <span>·</span>
              <a href="/terms" className="hover:underline">
                Terms
              </a>
              <span>·</span>
              <a href="/sitemap" className="hover:underline">
                Sitemap
              </a>
            </div>

            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-sm font-medium text-[#484848] hover:underline">
                <GlobeIcon className="h-4 w-4" />
                English (US)
              </button>
              <button className="text-sm font-medium text-[#484848] hover:underline">
                $ USD
              </button>
              <div className="flex items-center gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="h-5 w-5 text-[#484848]" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <TwitterIcon className="h-5 w-5 text-[#484848]" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="h-5 w-5 text-[#484848]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}
