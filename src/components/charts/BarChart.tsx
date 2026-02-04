type BarChartProps = {
  data: { label: string; value: number }[]
}

export function BarChart({ data }: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value), 1)
  const chartHeight = 200
  const chartWidth = 400
  const barWidth = (chartWidth - 40) / data.length - 10
  const padding = 40

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

      {/* Bars */}
      {data.map((d, i) => {
        const barHeight = (d.value / maxValue) * chartHeight
        const x = padding + i * (barWidth + 10) + 5
        const y = chartHeight - barHeight + 10

        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill="#FF5A5F"
              rx={4}
              className="hover:fill-[#E04E52] transition-colors"
            />
            <text
              x={x + barWidth / 2}
              y={chartHeight + 25}
              textAnchor="middle"
              className="fill-[#767676] text-[10px]"
            >
              {d.label}
            </text>
            <text
              x={x + barWidth / 2}
              y={y - 5}
              textAnchor="middle"
              className="fill-[#484848] text-[10px] font-medium"
            >
              {d.value}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
