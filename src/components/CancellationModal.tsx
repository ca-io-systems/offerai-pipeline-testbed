'use client'

import { useState } from 'react'
import { getCancellationPolicyDetails, calculateRefund } from '@/lib/utils'

type CancellationModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
  tripTitle: string
  checkInDate: string
  totalPrice: number
  cancellationPolicy: string
}

const CANCELLATION_REASONS = [
  'Change of plans',
  'Found better option',
  'Personal emergency',
  'Host issue',
  'Other',
]

export default function CancellationModal({
  isOpen,
  onClose,
  onConfirm,
  tripTitle,
  checkInDate,
  totalPrice,
  cancellationPolicy,
}: CancellationModalProps) {
  const [selectedReason, setSelectedReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const refundAmount = calculateRefund(totalPrice, checkInDate, cancellationPolicy)
  const policyDetails = getCancellationPolicyDetails(cancellationPolicy)

  const handleConfirm = async () => {
    if (!selectedReason) return
    setIsSubmitting(true)
    await onConfirm(selectedReason)
    setIsSubmitting(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#767676] hover:text-[#484848]"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 className="text-xl font-semibold text-[#484848] mb-4">
          Cancel Booking
        </h2>
        
        <p className="text-[#767676] mb-4">
          Are you sure you want to cancel your booking for <strong>{tripTitle}</strong>?
        </p>
        
        <div className="bg-[#F7F7F7] rounded-lg p-4 mb-4">
          <h3 className="font-medium text-[#484848] mb-2">
            Cancellation Policy: <span className="capitalize">{cancellationPolicy}</span>
          </h3>
          <p className="text-sm text-[#767676] mb-3">{policyDetails}</p>
          <div className="border-t border-[#EBEBEB] pt-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-[#767676]">Total paid</span>
              <span className="text-[#484848]">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="text-[#484848]">Your refund</span>
              <span className="text-[#008A05]">${refundAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#484848] mb-2">
            Reason for cancellation
          </label>
          <select
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
            className="w-full px-3 py-2 border border-[#EBEBEB] rounded-lg text-[#484848] focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
          >
            <option value="">Select a reason</option>
            {CANCELLATION_REASONS.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-[#EBEBEB] text-[#484848] rounded-lg font-medium hover:bg-[#F7F7F7] transition-colors"
          >
            Keep booking
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedReason || isSubmitting}
            className="flex-1 px-4 py-2 bg-[#C13515] text-white rounded-lg font-medium hover:bg-[#A02E12] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Cancelling...' : 'Confirm cancellation'}
          </button>
        </div>
      </div>
    </div>
  )
}
