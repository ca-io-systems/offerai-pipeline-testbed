import Link from 'next/link'

interface BreadcrumbProps {
  items: {
    label: string
    href?: string
  }[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-2 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {index > 0 && <span className="text-[#767676]">›</span>}
            {item.href ? (
              <Link href={item.href} className="text-[#767676] hover:underline">
                {item.label}
              </Link>
            ) : (
              <span className="text-[#484848]">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
