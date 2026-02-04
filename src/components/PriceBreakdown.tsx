import { formatCurrency } from '@/lib/utils'

interface PriceBreakdownProps {
  pricePerNight: number
  nights: number
  cleaningFee: number
  serviceFee: number
}

export function PriceBreakdown({ pricePerNight, nights, cleaningFee, serviceFee }: PriceBreakdownProps) {
  const accommodationTotal = pricePerNight * nights
  const total = accommodationTotal + cleaningFee + serviceFee

  return (
    <div className="space-y-3">
      <h3 className="text-xl font-semibold text-[#484848]">Price details</h3>
      <div className="space-y-2 text-[#484848]">
        <div className="flex justify-between">
          <span className="underline">
            {formatCurrency(pricePerNight)} x {nights} nights
          </span>
          <span>{formatCurrency(accommodationTotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="underline">Cleaning fee</span>
          <span>{formatCurrency(cleaningFee)}</span>
        </div>
        <div className="flex justify-between">
          <span className="underline">OfferBnb service fee</span>
          <span>{formatCurrency(serviceFee)}</span>
        </div>
      </div>
      <div className="flex justify-between pt-4 border-t border-[#EBEBEB] font-semibold text-[#484848]">
        <span>Total (USD)</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  )
}
