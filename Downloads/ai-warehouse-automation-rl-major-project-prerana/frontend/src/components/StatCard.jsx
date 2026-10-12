import { forwardRef } from 'react'

const COLOR_MAP = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500',
  pink: 'bg-pink-500',
}

export const StatCard = forwardRef(({ label, value, change, icon: Icon, color, delay = 0 }, ref) => {
  return (
    <div
      ref={ref}
      className="stat-card"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-surface-600">{label}</p>
          <p className="mt-1 text-2xl font-bold text-surface-900">{value}</p>
          <p className="mt-1 text-xs text-surface-500">{change}</p>
        </div>
        <div className={`p-3 rounded-xl ${COLOR_MAP[color] || 'bg-primary-500'}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )
})

StatCard.displayName = 'StatCard'