import { type PriceBreakdown as PriceBreakdownType } from '@/actions/booking'

interface PriceBreakdownProps {
  breakdown: PriceBreakdownType
}

export default function PriceBreakdown({ breakdown }: PriceBreakdownProps) {
  return (
    <div className="border-t border-[#EBEBEB] pt-4 space-y-3">
      <div className="flex justify-between text-[#484848]">
        <span className="underline">
          ${breakdown.nightlyRate} × {breakdown.nights} night{breakdown.nights !== 1 ? 's' : ''}
        </span>
        <span>${breakdown.accommodationTotal.toFixed(2)}</span>
      </div>

      {breakdown.cleaningFee > 0 && (
        <div className="flex justify-between text-[#484848]">
          <span className="underline">Cleaning fee</span>
          <span>${breakdown.cleaningFee.toFixed(2)}</span>
        </div>
      )}

      <div className="flex justify-between text-[#484848]">
        <span className="underline">Service fee</span>
        <span>${breakdown.serviceFee.toFixed(2)}</span>
      </div>

      <div className="flex justify-between font-semibold text-[#484848] pt-3 border-t border-[#EBEBEB]">
        <span>Total</span>
        <span>${breakdown.total.toFixed(2)}</span>
      </div>
    </div>
  )
}
