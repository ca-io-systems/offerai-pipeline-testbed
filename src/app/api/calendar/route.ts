import { NextRequest, NextResponse } from 'next/server'
import { generateIcsContent } from '@/lib/utils'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const title = searchParams.get('title') || 'OfferBnb Trip'
  const startDate = searchParams.get('startDate') || ''
  const endDate = searchParams.get('endDate') || ''
  const location = searchParams.get('location') || ''
  const description = searchParams.get('description') || ''

  const icsContent = generateIcsContent(title, startDate, endDate, location, description)

  return new NextResponse(icsContent, {
    headers: {
      'Content-Type': 'text/calendar',
      'Content-Disposition': `attachment; filename="offerbnb-booking.ics"`,
    },
  })
}
