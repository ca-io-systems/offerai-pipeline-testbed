import { test, expect } from 'bun:test'
import { calculateRefund, calculateDaysUntilCheckin, calculateRefundForBooking } from './calculator'

test('calculateDaysUntilCheckin returns correct days', () => {
  const checkIn = new Date('2024-01-15')
  const current = new Date('2024-01-10')
  expect(calculateDaysUntilCheckin(checkIn, current)).toBe(5)
})

test('calculateDaysUntilCheckin returns 0 for same day', () => {
  const checkIn = new Date('2024-01-15')
  const current = new Date('2024-01-15')
  expect(calculateDaysUntilCheckin(checkIn, current)).toBe(0)
})

test('calculateDaysUntilCheckin returns negative for past dates', () => {
  const checkIn = new Date('2024-01-10')
  const current = new Date('2024-01-15')
  expect(calculateDaysUntilCheckin(checkIn, current)).toBe(-5)
})

// Flexible policy tests
test('flexible: full refund 24+ hours before', () => {
  const result = calculateRefund('flexible', 500, 1)
  expect(result.refundAmount).toBe(500)
  expect(result.refundPercentage).toBe(100)
  expect(result.explanation).toContain('Full refund')
})

test('flexible: full refund 7 days before', () => {
  const result = calculateRefund('flexible', 500, 7)
  expect(result.refundAmount).toBe(500)
  expect(result.refundPercentage).toBe(100)
})

test('flexible: partial refund less than 24 hours', () => {
  const result = calculateRefund('flexible', 500, 0, 100)
  expect(result.refundAmount).toBe(400)
  expect(result.refundPercentage).toBe(80)
  expect(result.explanation).toContain('first night')
})

test('flexible: no nightly rate means 0 deduction', () => {
  const result = calculateRefund('flexible', 500, 0)
  expect(result.refundAmount).toBe(500)
  expect(result.refundPercentage).toBe(100)
})

// Moderate policy tests
test('moderate: full refund 5+ days before', () => {
  const result = calculateRefund('moderate', 500, 5)
  expect(result.refundAmount).toBe(500)
  expect(result.refundPercentage).toBe(100)
})

test('moderate: full refund 10 days before', () => {
  const result = calculateRefund('moderate', 500, 10)
  expect(result.refundAmount).toBe(500)
  expect(result.refundPercentage).toBe(100)
})

test('moderate: 50% refund 1-5 days before', () => {
  const result = calculateRefund('moderate', 500, 3)
  expect(result.refundAmount).toBe(250)
  expect(result.refundPercentage).toBe(50)
})

test('moderate: 50% refund at exactly 1 day', () => {
  const result = calculateRefund('moderate', 500, 1)
  expect(result.refundAmount).toBe(250)
  expect(result.refundPercentage).toBe(50)
})

test('moderate: 50% refund at 4 days', () => {
  const result = calculateRefund('moderate', 500, 4)
  expect(result.refundAmount).toBe(250)
  expect(result.refundPercentage).toBe(50)
})

test('moderate: no refund less than 1 day', () => {
  const result = calculateRefund('moderate', 500, 0)
  expect(result.refundAmount).toBe(0)
  expect(result.refundPercentage).toBe(0)
})

// Strict policy tests
test('strict: 50% refund 14+ days before', () => {
  const result = calculateRefund('strict', 500, 14)
  expect(result.refundAmount).toBe(250)
  expect(result.refundPercentage).toBe(50)
})

test('strict: 50% refund 30 days before', () => {
  const result = calculateRefund('strict', 500, 30)
  expect(result.refundAmount).toBe(250)
  expect(result.refundPercentage).toBe(50)
})

test('strict: no refund less than 14 days', () => {
  const result = calculateRefund('strict', 500, 13)
  expect(result.refundAmount).toBe(0)
  expect(result.refundPercentage).toBe(0)
})

test('strict: no refund at 7 days', () => {
  const result = calculateRefund('strict', 500, 7)
  expect(result.refundAmount).toBe(0)
  expect(result.refundPercentage).toBe(0)
})

test('strict: no refund at 0 days', () => {
  const result = calculateRefund('strict', 500, 0)
  expect(result.refundAmount).toBe(0)
  expect(result.refundPercentage).toBe(0)
})

// calculateRefundForBooking tests
test('calculateRefundForBooking uses all params correctly', () => {
  const result = calculateRefundForBooking({
    bookingId: 'booking-123',
    checkInDate: new Date('2024-01-20'),
    totalPaid: 1000,
    nightlyRate: 200,
    cancellationPolicy: 'flexible',
    currentDate: new Date('2024-01-10'),
  })
  expect(result.refundAmount).toBe(1000)
  expect(result.refundPercentage).toBe(100)
  expect(result.daysUntilCheckin).toBe(10)
  expect(result.policyType).toBe('flexible')
})

test('calculateRefundForBooking handles same day cancellation', () => {
  const result = calculateRefundForBooking({
    bookingId: 'booking-456',
    checkInDate: new Date('2024-01-15'),
    totalPaid: 600,
    nightlyRate: 150,
    cancellationPolicy: 'flexible',
    currentDate: new Date('2024-01-15'),
  })
  expect(result.refundAmount).toBe(450)
  expect(result.daysUntilCheckin).toBe(0)
})
