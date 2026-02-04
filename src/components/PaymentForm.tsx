'use client'

import { useActionState } from 'react'
import { createBooking } from '@/actions/booking'

interface PaymentFormProps {
  listingId: string
  checkIn: string
  checkOut: string
  guests: number
  houseRules: string | null
}

export function PaymentForm({ listingId, checkIn, checkOut, guests, houseRules }: PaymentFormProps) {
  const [error, formAction, isPending] = useActionState(
    async (_prevState: string | null, formData: FormData) => {
      const result = await createBooking({
        listingId,
        checkIn,
        checkOut,
        guests,
        cardNumber: formData.get('cardNumber') as string,
        expiration: formData.get('expiration') as string,
        cvv: formData.get('cvv') as string,
        billingAddress: formData.get('billingAddress') as string,
        billingCity: formData.get('billingCity') as string,
        billingZip: formData.get('billingZip') as string,
        billingCountry: formData.get('billingCountry') as string,
        agreeToRules: formData.get('agreeToRules') === 'on',
      })
      if (result?.error) {
        return result.error
      }
      return null
    },
    null
  )

  return (
    <form action={formAction}>
      <div className="border-b border-[#EBEBEB] pb-8 mb-8">
        <h2 className="text-xl font-semibold text-[#484848] mb-6">Pay with</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-[#484848] mb-1">
              Card number
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="w-full px-4 py-3 border border-[#EBEBEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#484848]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiration" className="block text-sm font-medium text-[#484848] mb-1">
                Expiration
              </label>
              <input
                type="text"
                id="expiration"
                name="expiration"
                placeholder="MM/YY"
                maxLength={5}
                className="w-full px-4 py-3 border border-[#EBEBEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#484848]"
                required
              />
            </div>
            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-[#484848] mb-1">
                CVV
              </label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                placeholder="123"
                maxLength={4}
                className="w-full px-4 py-3 border border-[#EBEBEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#484848]"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="billingAddress" className="block text-sm font-medium text-[#484848] mb-1">
              Billing address
            </label>
            <input
              type="text"
              id="billingAddress"
              name="billingAddress"
              placeholder="Street address"
              className="w-full px-4 py-3 border border-[#EBEBEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#484848]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="billingCity" className="block text-sm font-medium text-[#484848] mb-1">
                City
              </label>
              <input
                type="text"
                id="billingCity"
                name="billingCity"
                placeholder="City"
                className="w-full px-4 py-3 border border-[#EBEBEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#484848]"
                required
              />
            </div>
            <div>
              <label htmlFor="billingZip" className="block text-sm font-medium text-[#484848] mb-1">
                ZIP code
              </label>
              <input
                type="text"
                id="billingZip"
                name="billingZip"
                placeholder="12345"
                className="w-full px-4 py-3 border border-[#EBEBEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#484848]"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="billingCountry" className="block text-sm font-medium text-[#484848] mb-1">
              Country/region
            </label>
            <select
              id="billingCountry"
              name="billingCountry"
              className="w-full px-4 py-3 border border-[#EBEBEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#484848] bg-white"
              required
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="AU">Australia</option>
            </select>
          </div>
        </div>
      </div>

      <div className="border-b border-[#EBEBEB] pb-8 mb-8">
        <h2 className="text-xl font-semibold text-[#484848] mb-4">Ground rules</h2>
        <p className="text-[#767676] mb-4">
          We ask every guest to remember a few simple things about what makes a great guest.
        </p>
        {houseRules && (
          <ul className="text-[#484848] space-y-2 mb-4">
            {houseRules.split(',').map((rule, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#767676]">•</span>
                {rule.trim()}
              </li>
            ))}
          </ul>
        )}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="agreeToRules"
            className="mt-1 w-5 h-5 rounded border-[#EBEBEB] text-[#FF5A5F] focus:ring-[#FF5A5F]"
            required
          />
          <span className="text-[#484848]">
            I agree to the house rules, cancellation policy, and the{' '}
            <span className="underline">Guest Refund Policy</span>.
          </span>
        </label>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-[#C13515] rounded-lg text-[#C13515]">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-[#FF5A5F] text-white py-4 rounded-lg font-semibold text-lg hover:bg-[#E04E52] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Processing...' : 'Confirm and pay'}
      </button>

      <p className="mt-4 text-xs text-[#767676] text-center">
        By selecting the button, I agree to the Host&apos;s House Rules, Ground rules for guests,
        OfferBnb&apos;s Rebooking and Refund Policy, and that OfferBnb can charge my payment method
        if I&apos;m responsible for damage.
      </p>
    </form>
  )
}
