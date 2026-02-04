type PieChartProps = {
  data: { label: string; value: number }[]
}

const COLORS = ['#FF5A5F', '#008A05', '#FFB400', '#00A699', '#484848', '#767676', '#C13515', '#EBEBEB']

export function PieChart({ data }: PieChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1
  const size = 200
  const center = size / 2
  const radius = 70
  const innerRadius = 40

  let currentAngle = -Math.PI / 2 // Start from top

  const slices = data.map((d, i) => {
    const angle = (d.value / total) * Math.PI * 2
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    currentAngle = endAngle

    const x1 = center + radius * Math.cos(startAngle)
    const y1 = center + radius * Math.sin(startAngle)
    const x2 = center + radius * Math.cos(endAngle)
    const y2 = center + radius * Math.sin(endAngle)

    const ix1 = center + innerRadius * Math.cos(startAngle)
    const iy1 = center + innerRadius * Math.sin(startAngle)
    const ix2 = center + innerRadius * Math.cos(endAngle)
    const iy2 = center + innerRadius * Math.sin(endAngle)

    const largeArc = angle > Math.PI ? 1 : 0

    const path = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${ix2} ${iy2}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1}`,
      'Z',
    ].join(' ')

    return { path, color: COLORS[i % COLORS.length], label: d.label, value: d.value }
  })

  return (
    <div className="flex items-center justify-between">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-48 h-48">
        {slices.map((slice, i) => (
          <path
            key={i}
            d={slice.path}
            fill={slice.color}
            className="hover:opacity-80 transition-opacity cursor-pointer"
          />
        ))}
        {/* Center text */}
        <text
          x={center}
          y={center}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-[#484848] text-sm font-bold"
        >
          {total}
        </text>
        <text
          x={center}
          y={center + 14}
          textAnchor="middle"
          className="fill-[#767676] text-[10px]"
        >
          total
        </text>
      </svg>

      {/* Legend */}
      <div className="flex flex-col space-y-2">
        {slices.map((slice, i) => (
          <div key={i} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: slice.color }}
            />
            <span className="text-sm text-[#484848]">{slice.label}</span>
            <span className="text-sm text-[#767676]">({slice.value})</span>
          </div>
        ))}
      </div>
    </div>
  )
}
