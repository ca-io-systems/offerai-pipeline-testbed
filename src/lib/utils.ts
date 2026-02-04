export function formatDateRange(checkIn: string, checkOut: string): string {
  const startDate = new Date(checkIn)
  const endDate = new Date(checkOut)
  
  const startMonth = startDate.toLocaleDateString('en-US', { month: 'short' })
  const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' })
  const startDay = startDate.getDate()
  const endDay = endDate.getDate()
  const year = endDate.getFullYear()
  
  if (startMonth === endMonth) {
    return `${startMonth} ${startDay}-${endDay}, ${year}`
  }
  return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`
}

export function getDaysUntil(dateStr: string): number {
  const date = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  date.setHours(0, 0, 0, 0)
  const diffTime = date.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function formatCountdown(days: number): string {
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  if (days < 0) return `${Math.abs(days)} days ago`
  return `in ${days} days`
}

export function calculateRefund(
  totalPrice: number,
  checkInDate: string,
  policy: string
): number {
  const daysUntilCheckIn = getDaysUntil(checkInDate)
  
  switch (policy) {
    case 'flexible':
      // Full refund up to 24 hours before check-in
      return daysUntilCheckIn >= 1 ? totalPrice : 0
    case 'moderate':
      // Full refund 5+ days before, 50% refund otherwise
      if (daysUntilCheckIn >= 5) return totalPrice
      if (daysUntilCheckIn >= 1) return totalPrice * 0.5
      return 0
    case 'strict':
      // 50% refund 7+ days before, no refund otherwise
      return daysUntilCheckIn >= 7 ? totalPrice * 0.5 : 0
    default:
      return 0
  }
}

export function getCancellationPolicyDetails(policy: string): string {
  switch (policy) {
    case 'flexible':
      return 'Full refund up to 24 hours before check-in.'
    case 'moderate':
      return 'Full refund 5+ days before check-in. 50% refund otherwise (up to 24 hours before).'
    case 'strict':
      return '50% refund 7+ days before check-in. No refund within 7 days.'
    default:
      return 'Contact host for cancellation policy details.'
  }
}
