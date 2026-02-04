'use client'

import { useState, useCallback, useMemo } from 'react'
import {
  EarningsSummary,
  MonthlyEarning,
  EarningsTransaction,
  exportEarningsCSV,
} from '@/actions/earnings'

type Props = {
  summary: EarningsSummary
  monthlyEarnings: MonthlyEarning[]
  transactions: EarningsTransaction[]
}

function SummaryCard({
  title,
  amount,
  variant = 'default',
}: {
  title: string
  amount: number
  variant?: 'default' | 'primary' | 'warning'
}) {
  const colors = {
    default: 'bg-white',
    primary: 'bg-[#FF5A5F] text-white',
    warning: 'bg-[#FFB400] text-white',
  }
  
  return (
    <div className={`p-6 rounded-lg shadow-sm border border-[#EBEBEB] ${colors[variant]}`}>
      <p className={`text-sm ${variant === 'default' ? 'text-[#767676]' : 'opacity-90'}`}>
        {title}
      </p>
      <p className="text-3xl font-bold mt-2">
        ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </p>
    </div>
  )
}

function EarningsChart({ data }: { data: MonthlyEarning[] }) {
  const chartData = useMemo(() => {
    const maxAmount = Math.max(...data.map(d => d.amount), 1)
    const chartHeight = 200
    const chartWidth = 600
    const padding = 40
    const barWidth = (chartWidth - padding * 2) / data.length - 8
    
    return {
      maxAmount,
      chartHeight,
      chartWidth,
      padding,
      barWidth,
      bars: data.map((d, i) => ({
        x: padding + i * ((chartWidth - padding * 2) / data.length) + 4,
        height: (d.amount / maxAmount) * (chartHeight - padding * 2),
        ...d,
      })),
    }
  }, [data])
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-[#EBEBEB]">
      <h3 className="text-lg font-semibold mb-4">Monthly Earnings (Past 12 Months)</h3>
      
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartData.chartWidth} ${chartData.chartHeight}`}
          className="w-full min-w-[600px]"
        >
          {/* Y-axis labels */}
          <text x="10" y="35" className="text-xs fill-[#767676]">
            ${(chartData.maxAmount / 1000).toFixed(1)}k
          </text>
          <text x="10" y={chartData.chartHeight / 2} className="text-xs fill-[#767676]">
            ${(chartData.maxAmount / 2000).toFixed(1)}k
          </text>
          <text x="10" y={chartData.chartHeight - 25} className="text-xs fill-[#767676]">
            $0
          </text>
          
          {/* Grid lines */}
          <line
            x1={chartData.padding}
            y1={chartData.padding}
            x2={chartData.chartWidth - chartData.padding}
            y2={chartData.padding}
            stroke="#EBEBEB"
            strokeDasharray="4"
          />
          <line
            x1={chartData.padding}
            y1={chartData.chartHeight / 2}
            x2={chartData.chartWidth - chartData.padding}
            y2={chartData.chartHeight / 2}
            stroke="#EBEBEB"
            strokeDasharray="4"
          />
          <line
            x1={chartData.padding}
            y1={chartData.chartHeight - chartData.padding}
            x2={chartData.chartWidth - chartData.padding}
            y2={chartData.chartHeight - chartData.padding}
            stroke="#EBEBEB"
          />
          
          {/* Bars */}
          {chartData.bars.map((bar, i) => (
            <g key={i}>
              <rect
                x={bar.x}
                y={chartData.chartHeight - chartData.padding - bar.height}
                width={chartData.barWidth}
                height={bar.height}
                fill="#FF5A5F"
                rx="2"
              />
              <text
                x={bar.x + chartData.barWidth / 2}
                y={chartData.chartHeight - 10}
                textAnchor="middle"
                className="text-xs fill-[#767676]"
              >
                {bar.month}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}

function PayoutStatusBadge({ status }: { status: 'pending' | 'processing' | 'paid' }) {
  const colors = {
    pending: 'bg-[#FFB400] text-white',
    processing: 'bg-blue-500 text-white',
    paid: 'bg-[#008A05] text-white',
  }
  
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${colors[status]}`}>
      {status}
    </span>
  )
}

export default function EarningsTab({ summary, monthlyEarnings, transactions }: Props) {
  const [isExporting, setIsExporting] = useState(false)
  
  const handleExport = useCallback(async () => {
    setIsExporting(true)
    try {
      const csv = await exportEarningsCSV()
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'earnings.csv'
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setIsExporting(false)
    }
  }, [])
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Earnings</h2>
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="px-4 py-2 bg-[#FF5A5F] text-white rounded-lg hover:bg-[#E04E53] transition-colors disabled:opacity-50"
        >
          {isExporting ? 'Exporting...' : 'Export to CSV'}
        </button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <SummaryCard title="Total Earnings (All Time)" amount={summary.totalAllTime} variant="primary" />
        <SummaryCard title="This Month" amount={summary.thisMonth} />
        <SummaryCard title="Pending Payouts" amount={summary.pendingPayouts} variant="warning" />
      </div>
      
      {/* Chart */}
      <div className="mb-8">
        <EarningsChart data={monthlyEarnings} />
      </div>
      
      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-[#EBEBEB] overflow-hidden">
        <h3 className="text-lg font-semibold p-4 border-b border-[#EBEBEB]">
          Completed Bookings
        </h3>
        
        {transactions.length === 0 ? (
          <div className="text-center py-12 text-[#767676]">
            <p>No completed bookings yet.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-[#F7F7F7] text-left text-sm text-[#767676]">
              <tr>
                <th className="py-3 px-4 font-medium">Date</th>
                <th className="py-3 px-4 font-medium">Listing</th>
                <th className="py-3 px-4 font-medium">Guest</th>
                <th className="py-3 px-4 font-medium">Amount</th>
                <th className="py-3 px-4 font-medium">Payout Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id} className="border-b border-[#EBEBEB]">
                  <td className="py-4 px-4">
                    {new Date(transaction.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-4 px-4">{transaction.listingTitle}</td>
                  <td className="py-4 px-4">{transaction.guestName}</td>
                  <td className="py-4 px-4 font-medium">${transaction.amount.toFixed(2)}</td>
                  <td className="py-4 px-4">
                    <PayoutStatusBadge status={transaction.payoutStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
