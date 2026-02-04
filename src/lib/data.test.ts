import { test, expect } from 'bun:test'
import { getListings, getListingById, getCategories, getCategoryBySlug } from './data'

test('getListings returns all listings', () => {
  const listings = getListings()
  expect(listings.length).toBeGreaterThan(0)
  expect(listings[0]).toHaveProperty('id')
  expect(listings[0]).toHaveProperty('title')
  expect(listings[0]).toHaveProperty('city')
})

test('getListingById returns correct listing', () => {
  const listing = getListingById('1')
  expect(listing).toBeDefined()
  expect(listing?.id).toBe('1')
  expect(listing?.title).toBe('Cozy Downtown Apartment')
})

test('getListingById returns undefined for non-existent id', () => {
  const listing = getListingById('999')
  expect(listing).toBeUndefined()
})

test('getCategories returns all categories', () => {
  const categories = getCategories()
  expect(categories.length).toBeGreaterThan(0)
  expect(categories[0]).toHaveProperty('id')
  expect(categories[0]).toHaveProperty('name')
  expect(categories[0]).toHaveProperty('slug')
})

test('getCategoryBySlug returns correct category', () => {
  const category = getCategoryBySlug('beachfront')
  expect(category).toBeDefined()
  expect(category?.slug).toBe('beachfront')
  expect(category?.name).toBe('Beachfront')
})

test('getCategoryBySlug returns undefined for non-existent slug', () => {
  const category = getCategoryBySlug('nonexistent')
  expect(category).toBeUndefined()
})
