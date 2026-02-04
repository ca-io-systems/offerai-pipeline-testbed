import { test, expect } from 'bun:test'
import { generateId, formatRelativeTime } from './utils'

test('generateId returns a UUID', () => {
  const id = generateId()
  expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
})

test('generateId returns unique values', () => {
  const id1 = generateId()
  const id2 = generateId()
  expect(id1).not.toBe(id2)
})

test('formatRelativeTime returns "just now" for recent timestamps', () => {
  const now = new Date()
  expect(formatRelativeTime(now)).toBe('just now')
})

test('formatRelativeTime returns minutes ago', () => {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
  expect(formatRelativeTime(fiveMinutesAgo)).toBe('5 minutes ago')
})

test('formatRelativeTime returns singular minute', () => {
  const oneMinuteAgo = new Date(Date.now() - 1 * 60 * 1000)
  expect(formatRelativeTime(oneMinuteAgo)).toBe('1 minute ago')
})

test('formatRelativeTime returns hours ago', () => {
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
  expect(formatRelativeTime(twoHoursAgo)).toBe('2 hours ago')
})

test('formatRelativeTime returns singular hour', () => {
  const oneHourAgo = new Date(Date.now() - 1 * 60 * 60 * 1000)
  expect(formatRelativeTime(oneHourAgo)).toBe('1 hour ago')
})

test('formatRelativeTime returns days ago', () => {
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  expect(formatRelativeTime(threeDaysAgo)).toBe('3 days ago')
})

test('formatRelativeTime returns weeks ago', () => {
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
  expect(formatRelativeTime(twoWeeksAgo)).toBe('2 weeks ago')
})

test('formatRelativeTime returns months ago', () => {
  const twoMonthsAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
  expect(formatRelativeTime(twoMonthsAgo)).toBe('2 months ago')
})
