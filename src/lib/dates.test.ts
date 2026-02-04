import { test, expect, describe } from 'bun:test'
import {
  formatDate,
  parseDate,
  addDays,
  isDateInRange,
  getDaysInMonth,
  getFirstDayOfMonth,
  isSameDay,
  isBeforeDay,
  isAfterDay,
  daysBetween,
  getMonthName,
} from './dates'

describe('formatDate', () => {
  test('formats date to YYYY-MM-DD', () => {
    const date = new Date(2024, 0, 15) // January 15, 2024
    expect(formatDate(date)).toBe('2024-01-15')
  })

  test('pads single digit months and days', () => {
    const date = new Date(2024, 5, 5) // June 5, 2024
    expect(formatDate(date)).toBe('2024-06-05')
  })
})

describe('parseDate', () => {
  test('parses date string to Date', () => {
    const date = parseDate('2024-01-15')
    expect(date.getFullYear()).toBe(2024)
    expect(date.getMonth()).toBe(0)
    expect(date.getDate()).toBe(15)
  })
})

describe('addDays', () => {
  test('adds positive days', () => {
    const date = new Date(2024, 0, 15)
    const result = addDays(date, 5)
    expect(result.getDate()).toBe(20)
  })

  test('handles month rollover', () => {
    const date = new Date(2024, 0, 30)
    const result = addDays(date, 5)
    expect(result.getMonth()).toBe(1) // February
    expect(result.getDate()).toBe(4)
  })

  test('handles negative days', () => {
    const date = new Date(2024, 0, 15)
    const result = addDays(date, -5)
    expect(result.getDate()).toBe(10)
  })
})

describe('isDateInRange', () => {
  test('returns true for date in range', () => {
    const date = new Date(2024, 0, 15)
    const start = new Date(2024, 0, 10)
    const end = new Date(2024, 0, 20)
    expect(isDateInRange(date, start, end)).toBe(true)
  })

  test('returns true for date on start', () => {
    const date = new Date(2024, 0, 10)
    const start = new Date(2024, 0, 10)
    const end = new Date(2024, 0, 20)
    expect(isDateInRange(date, start, end)).toBe(true)
  })

  test('returns false for date on end (exclusive)', () => {
    const date = new Date(2024, 0, 20)
    const start = new Date(2024, 0, 10)
    const end = new Date(2024, 0, 20)
    expect(isDateInRange(date, start, end)).toBe(false)
  })

  test('returns false for date outside range', () => {
    const date = new Date(2024, 0, 5)
    const start = new Date(2024, 0, 10)
    const end = new Date(2024, 0, 20)
    expect(isDateInRange(date, start, end)).toBe(false)
  })
})

describe('getDaysInMonth', () => {
  test('returns 31 for January', () => {
    expect(getDaysInMonth(2024, 0)).toBe(31)
  })

  test('returns 29 for February in leap year', () => {
    expect(getDaysInMonth(2024, 1)).toBe(29)
  })

  test('returns 28 for February in non-leap year', () => {
    expect(getDaysInMonth(2023, 1)).toBe(28)
  })

  test('returns 30 for April', () => {
    expect(getDaysInMonth(2024, 3)).toBe(30)
  })
})

describe('getFirstDayOfMonth', () => {
  test('returns correct day of week (0 = Sunday)', () => {
    // January 1, 2024 is a Monday (1)
    expect(getFirstDayOfMonth(2024, 0)).toBe(1)
  })
})

describe('isSameDay', () => {
  test('returns true for same day', () => {
    const date1 = new Date(2024, 0, 15, 10, 30)
    const date2 = new Date(2024, 0, 15, 20, 45)
    expect(isSameDay(date1, date2)).toBe(true)
  })

  test('returns false for different days', () => {
    const date1 = new Date(2024, 0, 15)
    const date2 = new Date(2024, 0, 16)
    expect(isSameDay(date1, date2)).toBe(false)
  })
})

describe('isBeforeDay', () => {
  test('returns true when first date is before', () => {
    const date1 = new Date(2024, 0, 14)
    const date2 = new Date(2024, 0, 15)
    expect(isBeforeDay(date1, date2)).toBe(true)
  })

  test('returns false when same day', () => {
    const date1 = new Date(2024, 0, 15, 10)
    const date2 = new Date(2024, 0, 15, 20)
    expect(isBeforeDay(date1, date2)).toBe(false)
  })

  test('returns false when first date is after', () => {
    const date1 = new Date(2024, 0, 16)
    const date2 = new Date(2024, 0, 15)
    expect(isBeforeDay(date1, date2)).toBe(false)
  })
})

describe('isAfterDay', () => {
  test('returns true when first date is after', () => {
    const date1 = new Date(2024, 0, 16)
    const date2 = new Date(2024, 0, 15)
    expect(isAfterDay(date1, date2)).toBe(true)
  })

  test('returns false when same day', () => {
    const date1 = new Date(2024, 0, 15, 10)
    const date2 = new Date(2024, 0, 15, 20)
    expect(isAfterDay(date1, date2)).toBe(false)
  })
})

describe('daysBetween', () => {
  test('returns correct number of days', () => {
    const start = new Date(2024, 0, 10)
    const end = new Date(2024, 0, 15)
    expect(daysBetween(start, end)).toBe(5)
  })

  test('returns 0 for same day', () => {
    const start = new Date(2024, 0, 10)
    const end = new Date(2024, 0, 10)
    expect(daysBetween(start, end)).toBe(0)
  })

  test('handles month crossing', () => {
    const start = new Date(2024, 0, 30)
    const end = new Date(2024, 1, 5)
    expect(daysBetween(start, end)).toBe(6)
  })
})

describe('getMonthName', () => {
  test('returns correct month names', () => {
    expect(getMonthName(0)).toBe('January')
    expect(getMonthName(6)).toBe('July')
    expect(getMonthName(11)).toBe('December')
  })
})
