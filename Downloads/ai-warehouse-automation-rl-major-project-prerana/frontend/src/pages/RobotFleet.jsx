import { useState } from 'react'
import { useEpisodes, useResults } from '../hooks/useApi.js'
import {
  Bot,
  Battery,
  Package,
  MapPin,
  Zap,
  CheckCircle,
  Clock,
  TrendingUp,
  AlertCircle,
  Search,
  Filter,
  Download,
  ChevronDown,
  MoreHorizontal,
} from 'lucide-react'
import { Card } from '../components/Card'
import { StatCard } from '../components/StatCard'

const ROBOT_COLORS = [
  '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'
]

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

export function RobotFleet() {
  const { data: episodes } = useEpisodes()
  const { data: results } = useResults()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedRobot, setSelectedRobot] = useState(null)
  const [viewMode, setViewMode] = useState('grid')

  const latestEpisode = episodes?.[0]
  // Committed episodes store a single robot per frame (`robot`); the live
  // recorder stores a list (`robots`).  Normalise both shapes here.
  const lastFrame = latestEpisode?.frames?.[latestEpisode.frames.length - 1]
  const rawRobots = lastFrame?.robots || (lastFrame?.robot ? [lastFrame.robot] : [])
  const robots = rawRobots.map((r, index) => ({
    id: r.id != null ? String(r.id) : `robot_${index}`,
    x: r.position?.[0] ?? r.x ?? 0,
    y: r.position?.[1] ?? r.y ?? 0,
    battery: r.battery ?? 100,
    carrying: r.carrying ?? null,
    target: r.target ?? null,
    status: r.status || r.battery_state || 'idle',
    distance_travelled: r.distance_travelled ?? 0,
    deliveries_completed: r.deliveries_completed ?? 0,
    algorithm: r.algorithm || 'unknown',
  }))

  const filteredRobots = robots.filter(robot => {
    const matchesSearch = robot.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || robot.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalRobots = robots.length
  const activeRobots = robots.filter(r => r.status !== 'idle' && r.status !== 'completed').length
  const chargingRobots = robots.filter(r => r.status === 'charging').length
  const avgBattery = robots.length > 0
    ? Math.round(robots.reduce((sum, r) => sum + r.battery, 0) / robots.length)
    : 0

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Robot Fleet</h1>
          <p className="text-surface-500 mt-1">Monitor and manage all warehouse robots</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Robots" value={totalRobots.toString()} change={`${activeRobots} active`} icon={Bot} color="blue" />
        <StatCard label="Active Robots" value={activeRobots.toString()} change={`${chargingRobots} charging`} icon={Zap} color="green" />
        <StatCard label="Avg Battery" value={`${avgBattery}%`} change="Fleet average" icon={Battery} color="yellow" />
        <StatCard label="Total Deliveries" value={robots.reduce((sum, r) => sum + r.deliveries_completed, 0).toString()} change="This session" icon={Package} color="purple" />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 lg:w-3/4">
          <Card title="Robot Status" subtitle={`${filteredRobots.length} of ${robots.length} robots`}>
            <div className="flex flex-col sm:flex-row gap-4 mb-4 p-4 bg-surface-50 rounded-xl">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  type="text"
                  placeholder="Search robots..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-surface-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="select py-2 px-3"
                >
                  <option value="all">All Status</option>
                  <option value="idle">Idle</option>
                  <option value="moving">Moving</option>
                  <option value="delivering">Delivering</option>
                  <option value="charging">Charging</option>
                  <option value="completed">Completed</option>
                </select>
                <button className="btn-ghost" aria-label="Toggle view">
                  {viewMode === 'grid' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  )}
                </button>
              </div>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRobots.map((robot, index) => (
                  <RobotCard
                    key={robot.id}
                    robot={robot}
                    color={ROBOT_COLORS[index % ROBOT_COLORS.length]}
                    selected={selectedRobot === robot.id}
                    onClick={() => setSelectedRobot(selectedRobot === robot.id ? null : robot.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-surface-200 text-left text-sm font-medium text-surface-500">
                      <th className="pb-3 px-4">Robot</th>
                      <th className="pb-3 px-4">Status</th>
                      <th className="pb-3 px-4">Position</th>
                      <th className="pb-3 px-4">Battery</th>
                      <th className="pb-3 px-4">Deliveries</th>
                      <th className="pb-3 px-4">Distance</th>
                      <th className="pb-3 px-4">Algorithm</th>
                      <th className="pb-3 px-4">Task</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRobots.map((robot, index) => (
                      <tr key={robot.id} className={`border-b border-surface-100 hover:bg-surface-50 ${selectedRobot === robot.id ? 'bg-primary-50' : ''}`}>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                              style={{ backgroundColor: ROBOT_COLORS[index % ROBOT_COLORS.length] }}
                            >
                              {robot.id.replace('robot_', 'R')}
                            </div>
                            <span className="font-medium text-surface-900">{robot.id}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`badge ${STATUS_COLORS[robot.status] || 'badge-neutral'}`}>
                            {(() => {
                              const StatusIcon = STATUS_ICONS[robot.status]
                              return StatusIcon ? <StatusIcon className="w-3 h-3 mr-1" /> : null
                            })()}
                            {robot.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-surface-600 font-mono">({robot.x}, {robot.y})</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-surface-200 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${robot.battery}%`,
                                  backgroundColor: robot.battery > 30 ? '#22c55e' : robot.battery > 15 ? '#f59e0b' : '#ef4444',
                                }}
                              />
                            </div>
                            <span className="text-sm font-mono text-surface-600">{robot.battery}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-surface-600">{robot.deliveries_completed}</td>
                        <td className="py-3 px-4 text-surface-600 font-mono">{robot.distance_travelled}m</td>
                        <td className="py-3 px-4">
                          <span className="badge badge-info">{robot.algorithm.toUpperCase()}</span>
                        </td>
                        <td className="py-3 px-4 text-surface-600">{robot.carrying || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {filteredRobots.length === 0 && (
              <div className="text-center py-12 text-surface-500">
                <Bot className="w-12 h-12 mx-auto mb-4 text-surface-300" />
                <p>No robots match your filters</p>
              </div>
            )}
          </Card>
        </div>

        <div className="lg:w-1/4">
          {selectedRobot ? (
            <RobotDetailPanel robot={robots.find(r => r.id === selectedRobot)} onClose={() => setSelectedRobot(null)} />
          ) : (
            <Card title="Fleet Overview" className="h-full">
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-surface-50">
                  <h4 className="font-medium text-surface-900 mb-3">Battery Distribution</h4>
                  <div className="space-y-2">
                    <BatteryBar label="High (>50%)" value={robots.filter(r => r.battery > 50).length} total={totalRobots} color="green" />
                    <BatteryBar label="Medium (15-50%)" value={robots.filter(r => r.battery > 15 && r.battery <= 50).length} total={totalRobots} color="yellow" />
                    <BatteryBar label="Low (<15%)" value={robots.filter(r => r.battery <= 15).length} total={totalRobots} color="red" />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-surface-50">
                  <h4 className="font-medium text-surface-900 mb-3">Status Distribution</h4>
                  <div className="space-y-2">
                    {Object.entries(STATUS_COLORS).map(([status]) => (
                      <StatusBar
                        key={status}
                        label={status.charAt(0).toUpperCase() + status.slice(1)}
                        value={robots.filter(r => r.status === status).length}
                        total={totalRobots}
                        Icon={STATUS_ICONS[status]}
                      />
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-primary-50 border border-primary-100">
                  <h4 className="font-medium text-primary-900 mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Quick Actions
                  </h4>
                  <div className="space-y-2">
                    <button className="w-full btn-secondary justify-start">Send All to Charge</button>
                    <button className="w-full btn-secondary justify-start">Emergency Stop</button>
                    <button className="w-full btn-ghost justify-start text-red-600 hover:bg-red-50">Recall All Robots</button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function RobotCard({ robot, color, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border-2 transition-all ${
        selected
          ? 'border-primary-500 bg-primary-50 shadow-lg'
          : 'border-surface-200 hover:border-primary-200 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm"
          style={{ backgroundColor: color }}
        >
          {robot.id.replace('robot_', 'R')}
        </div>
<span className={`badge ${STATUS_COLORS[robot.status] || 'badge-neutral'}`}>
            {(() => {
              const StatusIcon = STATUS_ICONS[robot.status]
              return StatusIcon ? <StatusIcon className="w-3 h-3 mr-1" /> : null
            })()}
            {robot.status}
          </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-surface-500">Battery</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-surface-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${robot.battery}%`,
                  backgroundColor: robot.battery > 30 ? '#22c55e' : robot.battery > 15 ? '#f59e0b' : '#ef4444',
                }}
              />
            </div>
            <span className="font-mono text-surface-600">{robot.battery}%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-surface-500">Position</span>
            <p className="font-mono text-surface-900">({robot.x}, {robot.y})</p>
          </div>
          <div>
            <span className="text-surface-500">Deliveries</span>
            <p className="font-semibold text-surface-900">{robot.deliveries_completed}</p>
          </div>
          <div>
            <span className="text-surface-500">Distance</span>
            <p className="font-mono text-surface-900">{robot.distance_travelled}m</p>
          </div>
          <div>
            <span className="text-surface-500">Algorithm</span>
            <p className="font-medium text-surface-900">{robot.algorithm.toUpperCase()}</p>
          </div>
        </div>

        {robot.carrying && (
          <div className="p-2 rounded bg-purple-50 border border-purple-100">
            <p className="text-xs text-purple-900 flex items-center gap-1">
              <Package className="w-3 h-3" />
              Carrying: {robot.carrying}
            </p>
          </div>
        )}
      </div>
    </button>
  )
}

function RobotDetailPanel({ robot, onClose }) {
  return (
    <div className="card animate-slide-in">
      <div className="card-header flex items-center justify-between">
        <h3 className="text-lg font-semibold text-surface-900">Robot Details</h3>
        <button onClick={onClose} className="p-1 rounded hover:bg-surface-100 text-surface-400 hover:text-surface-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <div className="card-body space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-50">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: ROBOT_COLORS[0] }}
          >
            {robot.id.replace('robot_', 'R')}
          </div>
          <div>
            <p className="font-medium text-surface-900">{robot.id}</p>
            <span className={`badge ${STATUS_COLORS[robot.status] || 'badge-neutral'}`}>
              {(() => {
                const StatusIcon = STATUS_ICONS[robot.status]
                return StatusIcon ? <StatusIcon className="w-3 h-3 mr-1" /> : null
              })()}
              {robot.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <StatItem icon={Battery} label="Battery" value={`${robot.battery}%`} color={robot.battery > 30 ? 'green' : robot.battery > 15 ? 'yellow' : 'red'} />
          <StatItem icon={Package} label="Deliveries" value={robot.deliveries_completed} />
          <StatItem icon={MapPin} label="Position" value={`(${robot.x}, {robot.y})`} />
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

function BatteryBar({ label, value, total, color }) {
  const percentage = total > 0 ? (value / total) * 100 : 0
  const COLOR_MAP = { green: '#22c55e', yellow: '#f59e0b', red: '#ef4444' }

  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-surface-600">{label}</span>
        <span className="font-medium text-surface-900">{value}/{total}</span>
      </div>
      <div className="h-2 bg-surface-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${percentage}%`, backgroundColor: COLOR_MAP[color] }}
        />
      </div>
    </div>
  )
}

function StatusBar({ label, value, total, Icon }) {
  const percentage = total > 0 ? (value / total) * 100 : 0

  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-surface-600 flex items-center gap-1">
          <Icon className="w-3 h-3" />
          {label}
        </span>
        <span className="font-medium text-surface-900">{value}</span>
      </div>
      <div className="h-2 bg-surface-200 rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-primary-600 transition-all" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}