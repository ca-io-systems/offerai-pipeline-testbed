import { getPolicyDefinition } from './policies'
import type { CancellationPolicyType, RefundCalculationResult } from './types'

interface PolicyTimelineItemProps {
  daysLabel: string
  refundPercentage: number
  isPartial?: boolean
}

function PolicyTimelineItem({ daysLabel, refundPercentage, isPartial }: PolicyTimelineItemProps) {
  const getColor = () => {
    if (refundPercentage === 100) return { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' }
    if (refundPercentage === 50 || isPartial) return { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' }
    return { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' }
  }

  const colors = getColor()
  const displayText = isPartial ? 'Partial (minus first night)' : `${refundPercentage}% refund`

  return (
    <div className="flex items-center gap-3 py-2">
      <div className={`w-3 h-3 rounded-full ${colors.dot} shrink-0`} />
      <div className="flex-1">
        <span className="text-sm text-gray-600">{daysLabel}</span>
      </div>
      <span className={`text-sm font-medium px-2 py-1 rounded ${colors.bg} ${colors.text}`}>
        {displayText}
      </span>
    </div>
  )
}

interface CancellationPolicyProps {
  policyType: CancellationPolicyType
  showDescription?: boolean
  compact?: boolean
}

export function CancellationPolicy({ policyType, showDescription = true, compact = false }: CancellationPolicyProps) {
  const policy = getPolicyDefinition(policyType)

  if (compact) {
    return (
      <div className="text-sm">
        <span className="font-medium">{policy.name}</span>
        {showDescription && <span className="text-gray-500 ml-1">- {policy.description}</span>}
      </div>
    )
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="font-semibold text-lg mb-2">{policy.name} Cancellation Policy</h3>
      {showDescription && (
        <p className="text-gray-600 text-sm mb-4">{policy.description}</p>
      )}
      <div className="space-y-1">
        {policy.thresholds.map((threshold, index) => (
          <PolicyTimelineItem
            key={index}
            daysLabel={threshold.label}
            refundPercentage={threshold.refundPercentage}
            isPartial={threshold.refundPercentage === -1}
          />
        ))}
      </div>
    </div>
  )
}

interface CancellationPolicySummaryProps {
  policyType: CancellationPolicyType
}

export function CancellationPolicySummary({ policyType }: CancellationPolicySummaryProps) {
  const policy = getPolicyDefinition(policyType)
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-500">Cancellation policy:</span>
      <span className="font-medium">{policy.name}</span>
    </div>
  )
}

interface CancellationRefundDisplayProps {
  result: RefundCalculationResult
  showPolicyDetails?: boolean
}

export function CancellationRefundDisplay({ result, showPolicyDetails = true }: CancellationRefundDisplayProps) {
  const policy = getPolicyDefinition(result.policyType)

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="font-semibold text-lg mb-3">Cancellation Refund</h3>

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="text-2xl font-bold text-gray-900">
          ${result.refundAmount.toFixed(2)}
        </div>
        <div className="text-sm text-gray-500">
          {result.refundPercentage}% of total paid
        </div>
      </div>

      <div className="text-sm text-gray-700 mb-4">
        {result.explanation}
      </div>

      {result.daysUntilCheckin >= 0 && (
        <div className="text-xs text-gray-500 mb-4">
          {result.daysUntilCheckin} day{result.daysUntilCheckin !== 1 ? 's' : ''} until check-in
        </div>
      )}

      {showPolicyDetails && (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700">
            View {policy.name} policy details
          </summary>
          <div className="mt-3">
            <CancellationPolicy policyType={result.policyType} showDescription={false} />
          </div>
        </details>
      )}
    </div>
  )
}

interface CollapsibleCancellationPolicyProps {
  policyType: CancellationPolicyType
  defaultOpen?: boolean
}

export function CollapsibleCancellationPolicy({ policyType, defaultOpen = false }: CollapsibleCancellationPolicyProps) {
  const policy = getPolicyDefinition(policyType)

  return (
    <details open={defaultOpen} className="border border-gray-200 rounded-lg">
      <summary className="cursor-pointer p-4 font-medium hover:bg-gray-50">
        Cancellation Policy: {policy.name}
      </summary>
      <div className="px-4 pb-4 border-t border-gray-100">
        <CancellationPolicy policyType={policyType} />
      </div>
    </details>
  )
}

interface PolicySelectorProps {
  value: CancellationPolicyType
  onChange: (policy: CancellationPolicyType) => void
  disabled?: boolean
}

export function PolicySelector({ value, onChange, disabled = false }: PolicySelectorProps) {
  const policies: CancellationPolicyType[] = ['flexible', 'moderate', 'strict']

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Cancellation Policy
      </label>
      <div className="space-y-2">
        {policies.map((policy) => {
          const definition = getPolicyDefinition(policy)
          const isSelected = value === policy
          return (
            <label
              key={policy}
              className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input
                type="radio"
                name="cancellationPolicy"
                value={policy}
                checked={isSelected}
                onChange={() => onChange(policy)}
                disabled={disabled}
                className="mt-1"
              />
              <div>
                <div className="font-medium">{definition.name}</div>
                <div className="text-sm text-gray-500">{definition.description}</div>
              </div>
            </label>
          )
        })}
      </div>
    </div>
  )
}
