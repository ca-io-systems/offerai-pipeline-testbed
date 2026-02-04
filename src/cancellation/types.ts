export const CANCELLATION_POLICIES = ['flexible', 'moderate', 'strict'] as const
export type CancellationPolicyType = (typeof CANCELLATION_POLICIES)[number]

export interface PolicyThreshold {
  daysBeforeCheckin: number
  refundPercentage: number
  label: string
}

export interface PolicyDefinition {
  type: CancellationPolicyType
  name: string
  description: string
  thresholds: PolicyThreshold[]
}

export interface RefundCalculationResult {
  refundAmount: number
  refundPercentage: number
  policyType: CancellationPolicyType
  daysUntilCheckin: number
  explanation: string
}

export interface Listing {
  id: string
  cancellationPolicy: CancellationPolicyType
}

export interface Booking {
  id: string
  listingId: string
  checkInDate: Date
  totalPaid: number
  nightlyRate: number
  numberOfNights: number
}
