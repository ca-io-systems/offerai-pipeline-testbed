export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function parseDate(dateStr: string): Date {
  return new Date(dateStr + 'T00:00:00')
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function isDateInRange(date: Date, start: Date, end: Date): boolean {
  const d = formatDate(date)
  const s = formatDate(start)
  const e = formatDate(end)
  return d >= s && d < e
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return formatDate(date1) === formatDate(date2)
}

export function isBeforeDay(date1: Date, date2: Date): boolean {
  return formatDate(date1) < formatDate(date2)
}

export function isAfterDay(date1: Date, date2: Date): boolean {
  return formatDate(date1) > formatDate(date2)
}

export function daysBetween(start: Date, end: Date): number {
  const startDate = parseDate(formatDate(start))
  const endDate = parseDate(formatDate(end))
  const diffTime = endDate.getTime() - startDate.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function getMonthName(month: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  return months[month]
}
