type CategoryRatingBarProps = {
  label: string
  value: number
}

export function CategoryRatingBar({ label, value }: CategoryRatingBarProps) {
  const percentage = (value / 5) * 100

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-[#484848] w-28 shrink-0">{label}</span>
      <div className="flex-1 h-1 bg-[#EBEBEB] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#484848] rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm font-medium w-8 text-right">{value.toFixed(1)}</span>
    </div>
  )
}
