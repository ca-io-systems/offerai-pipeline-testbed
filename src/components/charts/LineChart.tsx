type LineChartProps = {
  data: { label: string; value: number }[]
  color?: string
}

export function LineChart({ data, color = '#FF5A5F' }: LineChartProps) {
  const maxValue = Math.max(...data.map(d => d.value), 1)
  const chartHeight = 200
  const chartWidth = 400
  const padding = 40
  const pointSpacing = (chartWidth - padding - 20) / (data.length - 1 || 1)

  const points = data.map((d, i) => ({
    x: padding + i * pointSpacing,
    y: chartHeight - (d.value / maxValue) * chartHeight + 10,
    value: d.value,
    label: d.label,
  }))

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ')

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight + 10} L ${points[0].x} ${chartHeight + 10} Z`

  return (
    <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 40}`} className="w-full h-auto">
      {/* Y-axis labels */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
        <g key={i}>
          <text
            x={padding - 5}
            y={chartHeight - ratio * chartHeight + 10}
            textAnchor="end"
            className="fill-[#767676] text-[10px]"
          >
            {Math.round(maxValue * ratio)}
          </text>
          <line
            x1={padding}
            y1={chartHeight - ratio * chartHeight + 10}
            x2={chartWidth}
            y2={chartHeight - ratio * chartHeight + 10}
            stroke="#EBEBEB"
            strokeDasharray="4"
          />
        </g>
      ))}

      {/* Area under line */}
      <path d={areaPath} fill={color} fillOpacity={0.1} />

      {/* Line */}
      <path d={linePath} fill="none" stroke={color} strokeWidth={2} />

      {/* Points and labels */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={4} fill={color} />
          <text
            x={p.x}
            y={chartHeight + 25}
            textAnchor="middle"
            className="fill-[#767676] text-[10px]"
          >
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  )
}
