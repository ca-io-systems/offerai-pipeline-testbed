import { test, expect } from 'bun:test'
import { generateWebSiteSchema, generateBreadcrumbSchema, generateLodgingBusinessSchema } from './JsonLd'
import type { Listing } from '@/lib/types'

test('generateWebSiteSchema returns valid schema', () => {
  const schema = generateWebSiteSchema()
  expect(schema['@context']).toBe('https://schema.org')
  expect(schema['@type']).toBe('WebSite')
  expect(schema.potentialAction['@type']).toBe('SearchAction')
})

test('generateBreadcrumbSchema returns valid schema', () => {
  const items = [
    { name: 'Home', url: 'https://example.com' },
    { name: 'Category', url: 'https://example.com/category' },
  ]
  const schema = generateBreadcrumbSchema(items)
  expect(schema['@context']).toBe('https://schema.org')
  expect(schema['@type']).toBe('BreadcrumbList')
  expect(schema.itemListElement).toHaveLength(2)
  expect(schema.itemListElement[0].position).toBe(1)
  expect(schema.itemListElement[1].position).toBe(2)
})

test('generateLodgingBusinessSchema returns valid schema', () => {
  const listing: Listing = {
    id: '1',
    title: 'Test Listing',
    description: 'Test description',
    city: 'Test City',
    country: 'Test Country',
    address: '123 Test St',
    pricePerNight: 100,
    images: ['https://example.com/image.jpg'],
    rating: 4.5,
    reviewCount: 50,
    hostName: 'Test Host',
    updatedAt: '2024-01-01',
  }
  const schema = generateLodgingBusinessSchema(listing)
  expect(schema['@context']).toBe('https://schema.org')
  expect(schema['@type']).toBe('LodgingBusiness')
  expect(schema.name).toBe('Test Listing')
  expect(schema.priceRange).toBe('$100/night')
  expect(schema.aggregateRating.ratingValue).toBe(4.5)
  expect(schema.aggregateRating.reviewCount).toBe(50)
})
