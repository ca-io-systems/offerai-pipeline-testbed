import { POLICY_DEFINITIONS } from './policies'
import type { CancellationPolicyType, RefundCalculationResult } from './types'

export function calculateDaysUntilCheckin(checkInDate: Date, currentDate: Date = new Date()): number {
  const checkin = new Date(checkInDate)
  checkin.setHours(0, 0, 0, 0)
  const current = new Date(currentDate)
  current.setHours(0, 0, 0, 0)
  const diffMs = checkin.getTime() - current.getTime()
  return Math.floor(diffMs / (1000 * 60 * 60 * 24))
}

export function calculateRefund(
  policyType: CancellationPolicyType,
  totalPaid: number,
  daysUntilCheckin: number,
  nightlyRate?: number
): RefundCalculationResult {
  const policy = POLICY_DEFINITIONS[policyType]

  if (policyType === 'flexible') {
    if (daysUntilCheckin >= 1) {
      return {
        refundAmount: totalPaid,
        refundPercentage: 100,
        policyType,
        daysUntilCheckin,
        explanation: 'Full refund - cancelled 24+ hours before check-in.',
      }
    } else {
      // Partial refund: total minus first night
      const firstNightCost = nightlyRate ?? 0
      const refundAmount = Math.max(0, totalPaid - firstNightCost)
      const refundPercentage = totalPaid > 0 ? Math.round((refundAmount / totalPaid) * 100) : 0
      return {
        refundAmount,
        refundPercentage,
        policyType,
        daysUntilCheckin,
        explanation: `Partial refund - first night charge of $${firstNightCost.toFixed(2)} deducted for cancellation less than 24 hours before check-in.`,
      }
    }
  }

  if (policyType === 'moderate') {
    if (daysUntilCheckin >= 5) {
      return {
        refundAmount: totalPaid,
        refundPercentage: 100,
        policyType,
        daysUntilCheckin,
        explanation: 'Full refund - cancelled 5+ days before check-in.',
      }
    } else if (daysUntilCheckin >= 1) {
      const refundAmount = totalPaid * 0.5
      return {
        refundAmount,
        refundPercentage: 50,
        policyType,
        daysUntilCheckin,
        explanation: '50% refund - cancelled 1-5 days before check-in.',
      }
    } else {
      return {
        refundAmount: 0,
        refundPercentage: 0,
        policyType,
        daysUntilCheckin,
        explanation: 'No refund - cancelled less than 1 day before check-in.',
      }
    }
  }

  // Strict policy
  if (daysUntilCheckin >= 14) {
    const refundAmount = totalPaid * 0.5
    return {
      refundAmount,
      refundPercentage: 50,
      policyType,
      daysUntilCheckin,
      explanation: '50% refund - cancelled 14+ days before check-in.',
    }
  } else {
    return {
      refundAmount: 0,
      refundPercentage: 0,
      policyType,
      daysUntilCheckin,
      explanation: 'No refund - cancelled less than 14 days before check-in.',
    }
  }
}

export interface CalculateRefundForBookingParams {
  bookingId: string
  checkInDate: Date
  totalPaid: number
  nightlyRate: number
  cancellationPolicy: CancellationPolicyType
  currentDate?: Date
}

export function calculateRefundForBooking(params: CalculateRefundForBookingParams): RefundCalculationResult {
  const {
    checkInDate,
    totalPaid,
    nightlyRate,
    cancellationPolicy,
    currentDate = new Date(),
  } = params

  const daysUntilCheckin = calculateDaysUntilCheckin(checkInDate, currentDate)
  return calculateRefund(cancellationPolicy, totalPaid, daysUntilCheckin, nightlyRate)
}
