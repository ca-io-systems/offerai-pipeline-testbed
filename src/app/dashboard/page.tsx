const stats = [
  { label: 'Total Earnings', value: '$12,450', change: '+12%' },
  { label: 'Bookings', value: '24', change: '+8%' },
  { label: 'Views', value: '1,234', change: '+23%' },
  { label: 'Rating', value: '4.92', change: '+0.1' },
]

const recentReservations = [
  { guest: 'John D.', listing: 'Ocean View Apartment', dates: 'Dec 15-20', amount: '$1,250' },
  { guest: 'Sarah M.', listing: 'Mountain Cabin', dates: 'Dec 22-27', amount: '$875' },
  { guest: 'Mike R.', listing: 'Ocean View Apartment', dates: 'Jan 2-7', amount: '$1,250' },
]

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-[#484848] mb-6">Overview</h1>

      {/* Stats Grid - Stack on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 md:p-6 border border-[#EBEBEB]">
            <p className="text-sm text-[#767676] mb-1">{stat.label}</p>
            <p className="text-2xl md:text-3xl font-bold text-[#484848]">{stat.value}</p>
            <p className="text-sm text-[#008A05] mt-1">{stat.change} from last month</p>
          </div>
        ))}
      </div>

      {/* Recent Reservations */}
      <div className="bg-white rounded-xl border border-[#EBEBEB]">
        <div className="p-4 md:p-6 border-b border-[#EBEBEB]">
          <h2 className="text-lg font-semibold text-[#484848]">Recent Reservations</h2>
        </div>

        {/* Mobile Card Layout */}
        <div className="md:hidden">
          {recentReservations.map((reservation, index) => (
            <div key={index} className="p-4 border-b border-[#EBEBEB] last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-[#484848]">{reservation.guest}</span>
                <span className="font-semibold text-[#484848]">{reservation.amount}</span>
              </div>
              <p className="text-sm text-[#767676]">{reservation.listing}</p>
              <p className="text-sm text-[#767676]">{reservation.dates}</p>
            </div>
          ))}
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#EBEBEB]">
                <th className="text-left p-4 text-sm font-medium text-[#767676]">Guest</th>
                <th className="text-left p-4 text-sm font-medium text-[#767676]">Listing</th>
                <th className="text-left p-4 text-sm font-medium text-[#767676]">Dates</th>
                <th className="text-right p-4 text-sm font-medium text-[#767676]">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentReservations.map((reservation, index) => (
                <tr key={index} className="border-b border-[#EBEBEB] last:border-b-0 hover:bg-[#F7F7F7]">
                  <td className="p-4 text-[#484848]">{reservation.guest}</td>
                  <td className="p-4 text-[#484848]">{reservation.listing}</td>
                  <td className="p-4 text-[#484848]">{reservation.dates}</td>
                  <td className="p-4 text-[#484848] text-right font-medium">{reservation.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
