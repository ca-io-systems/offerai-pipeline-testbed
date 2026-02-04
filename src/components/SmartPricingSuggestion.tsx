interface Props {
  currentPrice: number
  averageAreaPrice: number
  similarListings: number
}

export function SmartPricingSuggestion({
  currentPrice,
  averageAreaPrice,
  similarListings,
}: Props) {
  if (similarListings === 0) {
    return (
      <div className="border border-[#EBEBEB] rounded-xl p-4">
        <h3 className="font-semibold text-[#484848] mb-2">Smart Pricing</h3>
        <p className="text-sm text-[#767676]">
          No similar listings found in your area to compare prices.
        </p>
      </div>
    )
  }

  const priceDiff = currentPrice - averageAreaPrice
  const percentDiff = Math.round((priceDiff / averageAreaPrice) * 100)
  const isAboveAverage = priceDiff > 0
  const isSignificant = Math.abs(percentDiff) >= 10

  return (
    <div className="border border-[#EBEBEB] rounded-xl p-4">
      <h3 className="font-semibold text-[#484848] mb-2">Smart Pricing</h3>

      <div className="space-y-3">
        <div>
          <p className="text-sm text-[#767676]">Your base price</p>
          <p className="text-2xl font-bold text-[#484848]">${currentPrice}</p>
        </div>

        <div>
          <p className="text-sm text-[#767676]">
            Average in your area ({similarListings} similar listing{similarListings > 1 ? 's' : ''})
          </p>
          <p className="text-xl font-semibold text-[#484848]">${averageAreaPrice}</p>
        </div>

        {isSignificant && (
          <div
            className={`p-3 rounded-lg ${
              isAboveAverage ? 'bg-yellow-50' : 'bg-green-50'
            }`}
          >
            <p className="text-sm">
              {isAboveAverage ? (
                <>
                  Your price is{' '}
                  <span className="font-semibold text-[#FFB400]">
                    {percentDiff}% above
                  </span>{' '}
                  the area average. Consider lowering to increase bookings.
                </>
              ) : (
                <>
                  Your price is{' '}
                  <span className="font-semibold text-[#008A05]">
                    {Math.abs(percentDiff)}% below
                  </span>{' '}
                  the area average. You could potentially increase your rate.
                </>
              )}
            </p>
          </div>
        )}

        {!isSignificant && (
          <div className="p-3 rounded-lg bg-green-50">
            <p className="text-sm text-[#008A05]">
              Your price is competitive with similar listings in your area.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
