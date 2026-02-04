'use client'

import { useState } from 'react'
import { updateWeekendMultiplier } from '@/actions/pricing'

interface Props {
  listingId: number
  currentMultiplier: number
  basePrice: number
}

export function WeekendPricingSettings({
  listingId,
  currentMultiplier,
  basePrice,
}: Props) {
  const [multiplier, setMultiplier] = useState(currentMultiplier.toString())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setIsSubmitting(true)
    await updateWeekendMultiplier(listingId, parseFloat(multiplier))
    setIsSubmitting(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const weekendPrice = Math.round(basePrice * parseFloat(multiplier || '1'))

  return (
    <div className="border border-[#EBEBEB] rounded-xl p-4">
      <h3 className="font-semibold text-[#484848] mb-3">Weekend Pricing</h3>
      <p className="text-sm text-[#767676] mb-3">
        Automatically apply a multiplier to Friday and Saturday nights.
      </p>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-[#484848] mb-1">
            Weekend multiplier
          </label>
          <input
            type="number"
            step="0.1"
            min="1"
            value={multiplier}
            onChange={e => setMultiplier(e.target.value)}
            className="w-full border border-[#EBEBEB] rounded-lg px-3 py-2 focus:outline-none focus:border-[#FF5A5F]"
          />
          <p className="text-xs text-[#767676] mt-1">
            Weekend price: ${weekendPrice}/night (base: ${basePrice})
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setMultiplier('1')}
            className="text-sm text-[#767676] hover:text-[#484848]"
          >
            1x (none)
          </button>
          <button
            onClick={() => setMultiplier('1.1')}
            className="text-sm text-[#767676] hover:text-[#484848]"
          >
            1.1x
          </button>
          <button
            onClick={() => setMultiplier('1.2')}
            className="text-sm text-[#767676] hover:text-[#484848]"
          >
            1.2x
          </button>
          <button
            onClick={() => setMultiplier('1.5')}
            className="text-sm text-[#767676] hover:text-[#484848]"
          >
            1.5x
          </button>
        </div>

        <button
          onClick={handleSave}
          disabled={isSubmitting}
          className="w-full bg-[#FF5A5F] text-white rounded-lg py-2 hover:bg-[#E04E53] disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : saved ? 'Saved!' : 'Save'}
        </button>
      </div>
    </div>
  )
}
