'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateReportStatus, warnHost, removeContent } from '@/actions/reports'

type Report = {
  id: number
  reason: string
  description: string | null
  status: string
  createdAt: Date
  reporterId: number
  listingId: number | null
  reviewId: number | null
  reporterName: string
  reporterEmail: string
  listing: {
    id: number
    title: string
    hostId: number
    hostName: string
    hostEmail: string
  } | null
}

type ReportsTableProps = {
  reports: Report[]
  initialStatus?: string
}

export function ReportsTable({ reports, initialStatus = 'all' }: ReportsTableProps) {
  const router = useRouter()
  const [status, setStatus] = useState(initialStatus)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const handleFilter = (newStatus: string) => {
    setStatus(newStatus)
    const params = new URLSearchParams()
    if (newStatus !== 'all') params.set('status', newStatus)
    router.push(`/admin/reports?${params.toString()}`)
  }

  const handleDismiss = async (id: number) => {
    await updateReportStatus(id, 'dismissed')
    router.refresh()
  }

  const handleWarnHost = async (report: Report) => {
    if (report.listing) {
      await warnHost(report.listing.hostId, report.id)
      router.refresh()
    }
  }

  const handleRemoveContent = async (report: Report) => {
    if (report.listingId) {
      await removeContent(report.listingId, report.id)
      router.refresh()
    }
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-[#FFB400] text-white',
    dismissed: 'bg-[#767676] text-white',
    actioned: 'bg-[#008A05] text-white',
  }

  return (
    <>
      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['all', 'pending', 'dismissed', 'actioned'].map((s) => (
          <button
            key={s}
            onClick={() => handleFilter(s)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              status === s
                ? 'bg-[#FF5A5F] text-white'
                : 'bg-white text-[#484848] border border-[#EBEBEB] hover:bg-[#F7F7F7]'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-lg shadow-sm border border-[#EBEBEB] overflow-hidden"
          >
            {/* Main Content */}
            <div
              className="p-4 cursor-pointer hover:bg-[#F7F7F7]"
              onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full uppercase ${statusColors[report.status]}`}>
                      {report.status}
                    </span>
                    <span className="text-sm font-medium text-[#484848]">{report.reason}</span>
                  </div>
                  {report.listing && (
                    <p className="text-sm text-[#767676]">
                      Listing: <span className="text-[#484848] font-medium">{report.listing.title}</span>
                    </p>
                  )}
                  <p className="text-xs text-[#767676] mt-1">
                    Reported by {report.reporterName} on {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <svg
                  className={`w-5 h-5 text-[#767676] transition-transform ${expandedId === report.id ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedId === report.id && (
              <div className="border-t border-[#EBEBEB] p-4 bg-[#F7F7F7]">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-[#767676] uppercase font-medium mb-1">Reporter</p>
                    <p className="text-sm text-[#484848]">{report.reporterName}</p>
                    <p className="text-xs text-[#767676]">{report.reporterEmail}</p>
                  </div>
                  {report.listing && (
                    <div>
                      <p className="text-xs text-[#767676] uppercase font-medium mb-1">Host</p>
                      <p className="text-sm text-[#484848]">{report.listing.hostName}</p>
                      <p className="text-xs text-[#767676]">{report.listing.hostEmail}</p>
                    </div>
                  )}
                </div>

                {report.description && (
                  <div className="mb-4">
                    <p className="text-xs text-[#767676] uppercase font-medium mb-1">Description</p>
                    <p className="text-sm text-[#484848] bg-white p-3 rounded border border-[#EBEBEB]">
                      {report.description}
                    </p>
                  </div>
                )}

                {/* Actions */}
                {report.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDismiss(report.id)
                      }}
                      className="px-3 py-1.5 text-sm bg-[#767676] text-white rounded-md hover:bg-[#666666] transition-colors"
                    >
                      Dismiss
                    </button>
                    {report.listing && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleWarnHost(report)
                          }}
                          className="px-3 py-1.5 text-sm bg-[#FFB400] text-white rounded-md hover:bg-[#E0A000] transition-colors"
                        >
                          Warn Host
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveContent(report)
                          }}
                          className="px-3 py-1.5 text-sm bg-[#C13515] text-white rounded-md hover:bg-[#A12D12] transition-colors"
                        >
                          Remove Content
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {reports.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-[#EBEBEB] p-8 text-center text-[#767676]">
            No reports found.
          </div>
        )}
      </div>
    </>
  )
}
