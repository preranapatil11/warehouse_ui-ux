import {
  Battery,
  Package,
  MapPin,
  Zap,
  CheckCircle,
  Clock,
  TrendingUp,
  AlertCircle,
  Bot,
} from 'lucide-react'

const STATUS_COLORS = {
  idle: 'bg-surface-100 text-surface-600',
  moving: 'bg-blue-100 text-blue-700',
  delivering: 'bg-purple-100 text-purple-700',
  charging: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
}

const STATUS_ICONS = {
  idle: Bot,
  moving: MapPin,
  delivering: Package,
  charging: Zap,
  completed: CheckCircle,
}

const ROBOT_COLORS = [
  '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'
]

export function RobotPanel({ layout, currentFrame, selectedRobot, onSelectRobot, summary }) {
  if (!layout) return null

  const robots = currentFrame?.robots || layout.robots

  if (selectedRobot) {
    const robot = robots.find((r) => r.id === selectedRobot)
    if (!robot) return null

    return (
      <div className="card animate-slide-in">
        <div className="card-header flex items-center justify-between">
          <h3 className="text-lg font-semibold text-surface-900">{robot.id}</h3>
          <button
            onClick={() => onSelectRobot(null)}
            className="p-1 rounded hover:bg-surface-100 text-surface-400 hover:text-surface-600"
            aria-label="Close robot details"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="card-body space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-50">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="font-medium text-surface-900">{robot.id}</p>
              <span className={`badge ${STATUS_COLORS[robot.status] || 'badge-neutral'}`}>
                {(() => {
                  const StatusIcon = STATUS_ICONS[robot.status]
                  return StatusIcon ? <StatusIcon className="w-3 h-3 mr-1" /> : null
                })()}
                {robot.status.charAt(0).toUpperCase() + robot.status.slice(1)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <StatItem icon={Battery} label="Battery" value={`${robot.battery}%`} color={robot.battery > 30 ? 'green' : robot.battery > 15 ? 'yellow' : 'red'} />
            <StatItem icon={Package} label="Deliveries" value={robot.deliveries_completed} />
            <StatItem icon={MapPin} label="Position" value={`(${robot.x}, ${robot.y})`} />
            <StatItem icon={TrendingUp} label="Distance" value={`${robot.distance_travelled}m`} />
            <StatItem icon={Clock} label="Algorithm" value={robot.algorithm.toUpperCase()} />
            <StatItem icon={Zap} label="Carrying" value={robot.carrying || 'Nothing'} />
          </div>

          {robot.target && (
            <div className="p-3 rounded-lg bg-primary-50 border border-primary-100">
              <p className="text-sm font-medium text-primary-900 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Target: {robot.target}
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="card flex-1">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-surface-900">Robot Fleet</h3>
      </div>
      <div className="card-body p-0">
        <div className="divide-y divide-surface-200">
          {robots.map((robot) => (
            <button
              key={robot.id}
              onClick={() => onSelectRobot(robot.id)}
              className="w-full p-4 hover:bg-surface-50 transition-colors text-left flex items-center gap-3"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: ROBOT_COLORS[layout.robots.findIndex(r => r.id === robot.id) % ROBOT_COLORS.length] }}
              >
                {robot.id.replace('robot_', 'R')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-surface-900 truncate">{robot.id}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-surface-500">
                  <span className={`badge ${STATUS_COLORS[robot.status] || 'badge-neutral'} text-[10px] py-0.5 px-1.5`}>
                    {robot.status}
                  </span>
                  <span className="flex items-center gap-1">
                    <Battery className="w-3 h-3" />
                    {robot.battery}%
                  </span>
                  <span className="flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    {robot.deliveries_completed}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-surface-500">({robot.x}, {robot.y})</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatItem({ icon: Icon, label, value, color = 'blue' }) {
  const COLOR_MAP = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
  }

  return (
    <div className="p-3 rounded-lg bg-surface-50">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-surface-400" />
        <span className="text-xs text-surface-500">{label}</span>
      </div>
      <p className={`font-semibold text-surface-900 ${COLOR_MAP[color] || ''}`}>{value}</p>
    </div>
  )
}