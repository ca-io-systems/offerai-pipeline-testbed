import type { CancellationPolicyType, PolicyDefinition } from './types'

export const POLICY_DEFINITIONS: Record<CancellationPolicyType, PolicyDefinition> = {
  flexible: {
    type: 'flexible',
    name: 'Flexible',
    description: 'Full refund if cancelled 24+ hours before check-in. Partial refund for first night if cancelled less than 24 hours before.',
    thresholds: [
      { daysBeforeCheckin: 1, refundPercentage: 100, label: '24+ hours before check-in' },
      { daysBeforeCheckin: 0, refundPercentage: -1, label: 'Less than 24 hours' }, // -1 indicates partial (first night only)
    ],
  },
  moderate: {
    type: 'moderate',
    name: 'Moderate',
    description: 'Full refund if cancelled 5+ days before check-in. 50% refund if cancelled 1-5 days before. No refund if cancelled less than 1 day before.',
    thresholds: [
      { daysBeforeCheckin: 5, refundPercentage: 100, label: '5+ days before check-in' },
      { daysBeforeCheckin: 1, refundPercentage: 50, label: '1-5 days before check-in' },
      { daysBeforeCheckin: 0, refundPercentage: 0, label: 'Less than 1 day' },
    ],
  },
  strict: {
    type: 'strict',
    name: 'Strict',
    description: '50% refund if cancelled 14+ days before check-in. No refund if cancelled less than 14 days before.',
    thresholds: [
      { daysBeforeCheckin: 14, refundPercentage: 50, label: '14+ days before check-in' },
      { daysBeforeCheckin: 0, refundPercentage: 0, label: 'Less than 14 days' },
    ],
  },
}

export function getPolicyDefinition(policyType: CancellationPolicyType): PolicyDefinition {
  return POLICY_DEFINITIONS[policyType]
}
