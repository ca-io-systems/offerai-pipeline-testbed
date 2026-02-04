type Status = 'confirmed' | 'pending' | 'cancelled' | 'completed'

const statusStyles: Record<Status, string> = {
  confirmed: 'bg-[#008A05] text-white',
  pending: 'bg-[#FFB400] text-[#484848]',
  cancelled: 'bg-[#C13515] text-white',
  completed: 'bg-[#767676] text-white',
}

export default function StatusBadge({ status }: { status: string }) {
  const normalizedStatus = status as Status
  const style = statusStyles[normalizedStatus] || 'bg-[#EBEBEB] text-[#484848]'
  
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${style}`}>
      {status}
    </span>
  )
}
