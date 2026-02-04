'use client'

import { useState } from 'react'
import type { SeasonalPricing } from '@/db/schema'
import {
  createSeasonalPricing,
  updateSeasonalPricing,
  deleteSeasonalPricing,
} from '@/actions/pricing'

interface Props {
  listingId: number
  seasons: SeasonalPricing[]
  basePrice: number
}

export function SeasonalPricingManager({ listingId, seasons, basePrice }: Props) {
  const [localSeasons, setLocalSeasons] = useState(seasons)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  return (
    <div className="border border-[#EBEBEB] rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#484848]">Seasonal Pricing</h3>
        <button
          onClick={() => setIsAdding(true)}
          className="text-sm text-[#FF5A5F] hover:underline"
        >
          + Add Season
        </button>
      </div>

      {localSeasons.length === 0 && !isAdding && (
        <p className="text-sm text-[#767676]">
          No seasonal pricing rules. Add seasons to automatically adjust prices for specific date ranges.
        </p>
      )}

      <div className="space-y-3">
        {localSeasons.map(season => (
          <div key={season.id}>
            {editingId === season.id ? (
              <SeasonForm
                initialValues={season}
                basePrice={basePrice}
                onSubmit={async (values) => {
                  await updateSeasonalPricing(
                    season.id,
                    values.name,
                    values.startDate,
                    values.endDate,
                    values.multiplier
                  )
                  setLocalSeasons(prev =>
                    prev.map(s =>
                      s.id === season.id ? { ...s, ...values } : s
                    )
                  )
                  setEditingId(null)
                }}
                onCancel={() => setEditingId(null)}
                onDelete={async () => {
                  await deleteSeasonalPricing(season.id)
                  setLocalSeasons(prev => prev.filter(s => s.id !== season.id))
                  setEditingId(null)
                }}
              />
            ) : (
              <div
                onClick={() => setEditingId(season.id)}
                className="p-3 bg-[#F7F7F7] rounded-lg cursor-pointer hover:bg-[#EBEBEB] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#484848]">{season.name}</span>
                  <span className="text-sm text-[#FF5A5F]">{season.multiplier}x</span>
                </div>
                <p className="text-xs text-[#767676] mt-1">
                  {season.startDate} → {season.endDate}
                </p>
                <p className="text-xs text-[#767676]">
                  ${Math.round(basePrice * season.multiplier)}/night
                </p>
              </div>
            )}
          </div>
        ))}

        {isAdding && (
          <SeasonForm
            basePrice={basePrice}
            onSubmit={async (values) => {
              await createSeasonalPricing(
                listingId,
                values.name,
                values.startDate,
                values.endDate,
                values.multiplier
              )
              // Reload to get the new ID
              window.location.reload()
            }}
            onCancel={() => setIsAdding(false)}
          />
        )}
      </div>
    </div>
  )
}

interface SeasonFormProps {
  initialValues?: {
    name: string
    startDate: string
    endDate: string
    multiplier: number
  }
  basePrice: number
  onSubmit: (values: {
    name: string
    startDate: string
    endDate: string
    multiplier: number
  }) => Promise<void>
  onCancel: () => void
  onDelete?: () => Promise<void>
}

function SeasonForm({
  initialValues,
  basePrice,
  onSubmit,
  onCancel,
  onDelete,
}: SeasonFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '')
  const [startDate, setStartDate] = useState(initialValues?.startDate ?? '')
  const [endDate, setEndDate] = useState(initialValues?.endDate ?? '')
  const [multiplier, setMultiplier] = useState(
    initialValues?.multiplier.toString() ?? '1.5'
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!name || !startDate || !endDate || !multiplier) return
    setIsSubmitting(true)
    await onSubmit({
      name,
      startDate,
      endDate,
      multiplier: parseFloat(multiplier),
    })
    setIsSubmitting(false)
  }

  const handleDelete = async () => {
    if (!onDelete) return
    if (!confirm('Delete this seasonal pricing rule?')) return
    setIsSubmitting(true)
    await onDelete()
    setIsSubmitting(false)
  }

  return (
    <div className="p-3 border border-[#EBEBEB] rounded-lg space-y-3">
      <input
        type="text"
        placeholder="Season name (e.g., Summer Peak)"
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full border border-[#EBEBEB] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#FF5A5F]"
      />

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-[#767676] mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="w-full border border-[#EBEBEB] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#FF5A5F]"
          />
        </div>
        <div>
          <label className="block text-xs text-[#767676] mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="w-full border border-[#EBEBEB] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#FF5A5F]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-[#767676] mb-1">
          Multiplier (e.g., 1.5 = 50% increase)
        </label>
        <input
          type="number"
          step="0.1"
          min="0.1"
          value={multiplier}
          onChange={e => setMultiplier(e.target.value)}
          className="w-full border border-[#EBEBEB] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#FF5A5F]"
        />
        {multiplier && (
          <p className="text-xs text-[#767676] mt-1">
            Adjusted price: ${Math.round(basePrice * parseFloat(multiplier))}/night
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 border border-[#EBEBEB] rounded py-2 text-sm hover:bg-[#F7F7F7] disabled:opacity-50"
        >
          Cancel
        </button>
        {onDelete && (
          <button
            onClick={handleDelete}
            disabled={isSubmitting}
            className="px-3 border border-red-200 text-red-500 rounded py-2 text-sm hover:bg-red-50 disabled:opacity-50"
          >
            Delete
          </button>
        )}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !name || !startDate || !endDate}
          className="flex-1 bg-[#FF5A5F] text-white rounded py-2 text-sm hover:bg-[#E04E53] disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )
}
