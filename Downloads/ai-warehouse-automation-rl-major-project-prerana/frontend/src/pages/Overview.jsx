import {
  Bot,
  Package,
  Clock,
  Battery,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Settings,
  BarChart2,
} from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useHealth, useEpisodes, useResults } from '../hooks/useApi.js'
import { StatCard } from '../components/StatCard'
import { Card } from '../components/Card'

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

const deliveryPerformanceData = [
  { time: '00:00', delivered: 12, pending: 8 },
  { time: '04:00', delivered: 24, pending: 15 },
  { time: '08:00', delivered: 45, pending: 12 },
  { time: '12:00', delivered: 67, pending: 8 },
  { time: '16:00', delivered: 89, pending: 5 },
  { time: '20:00', delivered: 102, pending: 3 },
  { time: '24:00', delivered: 115, pending: 1 },
]

const energyData = [
  { hour: '0h', robot1: 100, robot2: 100, robot3: 95 },
  { hour: '2h', robot1: 85, robot2: 90, robot3: 80 },
  { hour: '4h', robot1: 70, robot2: 78, robot3: 65 },
  { hour: '6h', robot1: 55, robot2: 65, robot3: 50 },
  { hour: '8h', robot1: 40, robot2: 52, robot3: 35 },
  { hour: '10h', robot1: 25, robot2: 38, robot3: 20 },
  { hour: '12h', robot1: 15, robot2: 25, robot3: 10 },
]

const algorithmData = [
  { algorithm: 'A*', success: 95, steps: 42, efficiency: 98, collisions: 0 },
  { algorithm: 'BFS', success: 88, steps: 58, efficiency: 72, collisions: 2 },
  { algorithm: 'PPO', success: 92, steps: 45, efficiency: 94, collisions: 1 },
  { algorithm: 'Q-Learning', success: 75, steps: 72, efficiency: 65, collisions: 5 },
  { algorithm: 'Random', success: 25, steps: 180, efficiency: 15, collisions: 25 },
]

const robotActivityData = [
  { name: 'Robot 1', active: 65, idle: 20, charging: 15 },
  { name: 'Robot 2', active: 72, idle: 15, charging: 13 },
  { name: 'Robot 3', active: 58, idle: 25, charging: 17 },
  { name: 'Robot 4', active: 80, idle: 10, charging: 10 },
  { name: 'Robot 5', active: 45, idle: 30, charging: 25 },
]

const stats = [
  {
    label: 'Total Robots',
    value: '8',
    change: '+2 this week',
    icon: Bot,
    color: 'blue',
  },
  {
    label: 'Active Robots',
    value: '6',
    change: '75% utilization',
    icon: Bot,
    color: 'green',
  },
  {
    label: 'Packages Delivered',
    value: '1,234',
    change: '+12% vs last week',
    icon: Package,
    color: 'purple',
  },
  {
    label: 'Tasks Pending',
    value: '23',
    change: '5 high priority',
    icon: Clock,
    color: 'orange',
  },
  {
    label: 'Avg Delivery Time',
    value: '4m 32s',
    change: '-8% improvement',
    icon: Clock,
    color: 'blue',
  },
  {
    label: 'Battery Status',
    value: '78%',
    change: '2 charging',
    icon: Battery,
    color: 'yellow',
  },
  {
    label: 'Success Rate',
    value: '94.2%',
    change: '+1.2% this month',
    icon: CheckCircle,
    color: 'green',
  },
  {
    label: 'Total Collisions',
    value: '3',
    change: '0 critical',
    icon: AlertTriangle,
    color: 'red',
  },
]

export function Overview() {
  const { data: health, loading: healthLoading } = useHealth()
  const { data: episodes } = useEpisodes()
  const { data: results } = useResults()

  const totalEpisodes = episodes?.length || 0
  const totalResults = results?.length || 0

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Overview</h1>
          <p className="text-surface-500 mt-1">Warehouse AI — Intelligent Robot Navigation Simulator</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${healthLoading ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
            {healthLoading ? 'Connecting...' : 'Backend Connected'}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {totalEpisodes} Episodes Recorded
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            color={stat.color}
            delay={index * 50}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Delivery Performance" subtitle="Packages delivered vs pending over 24h">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={deliveryPerformanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="deliveredGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="pendingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ color: '#1e293b', fontWeight: 600 }}
                />
                <Legend />
                <Area type="monotone" dataKey="delivered" stroke="#3b82f6" fillOpacity={1} fill="url(#deliveredGradient)" name="Delivered" />
                <Area type="monotone" dataKey="pending" stroke="#f59e0b" fillOpacity={1} fill="url(#pendingGradient)" name="Pending" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Energy Consumption" subtitle="Battery levels across robot fleet over 12h">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={energyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 110]} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  labelStyle={{ color: '#1e293b', fontWeight: 600 }}
                />
                <Legend />
                <Line type="monotone" dataKey="robot1" stroke="#3b82f6" strokeWidth={2} dot={false} name="Robot 1" activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="robot2" stroke="#22c55e" strokeWidth={2} dot={false} name="Robot 2" activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="robot3" stroke="#f59e0b" strokeWidth={2} dot={false} name="Robot 3" activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Algorithm Comparison" subtitle="Success rate, efficiency, and collision metrics">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={algorithmData} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <YAxis dataKey="algorithm" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} width={60} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  labelStyle={{ color: '#1e293b', fontWeight: 600 }}
                />
                <Legend />
                <Bar dataKey="success" fill="#22c55e" name="Success Rate (%)" radius={[0, 4, 4, 0]} />
                <Bar dataKey="efficiency" fill="#3b82f6" name="Path Efficiency (%)" radius={[0, 4, 4, 0]} />
                <Bar dataKey="collisions" fill="#ef4444" name="Collisions" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Robot Activity Distribution" subtitle="Time spent active, idle, and charging">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={robotActivityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  labelStyle={{ color: '#1e293b', fontWeight: 600 }}
                />
                <Legend />
                <Bar dataKey="active" fill="#3b82f6" name="Active" stackId="a" />
                <Bar dataKey="idle" fill="#94a3b8" name="Idle" stackId="a" />
                <Bar dataKey="charging" fill="#f59e0b" name="Charging" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Episodes" subtitle="Latest simulation runs">
          <div className="space-y-3">
            {episodes && episodes.slice(0, 5).map((ep) => {
              const summary = ep.summary || {}
              const success = summary.termination_reason === 'all_tasks_delivered'
              const steps = summary.steps ?? ep.frames ?? 0
              return (
                <div key={ep.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-50 hover:bg-surface-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${success ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div>
                      <p className="text-sm font-medium text-surface-900">{ep.scenario}</p>
                      <p className="text-xs text-surface-500">{ep.controller.toUpperCase()} • Seed: {ep.seed} • {ep.frames} frames</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className={`badge ${success ? 'badge-success' : 'badge-danger'}`}>
                      {success ? 'Success' : (summary.termination_reason || 'Failed')}
                    </span>
                    <span className="text-surface-500">{steps} steps</span>
                  </div>
                </div>
              )
            })}
            {(!episodes || episodes.length === 0) && (
              <div className="text-center py-8 text-surface-500">
                <RefreshCw className="w-8 h-8 mx-auto mb-2 text-surface-300" />
                <p>No episodes recorded yet</p>
                <p className="text-xs">Run a simulation to see results here</p>
              </div>
            )}
          </div>
        </Card>

        <Card title="Quick Actions" subtitle="Common operations">
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 rounded-xl border border-surface-200 hover:border-primary-300 hover:bg-primary-50 transition-all text-left group">
              <Bot className="w-6 h-6 text-primary-600 group-hover:scale-110 transition-transform" />
              <h3 className="mt-2 font-medium text-surface-900">Run Simulation</h3>
              <p className="text-xs text-surface-500 mt-1">Start new episode</p>
            </button>
            <button className="p-4 rounded-xl border border-surface-200 hover:border-primary-300 hover:bg-primary-50 transition-all text-left group">
              <Package className="w-6 h-6 text-primary-600 group-hover:scale-110 transition-transform" />
              <h3 className="mt-2 font-medium text-surface-900">Create Task</h3>
              <p className="text-xs text-surface-500 mt-1">Add delivery task</p>
            </button>
            <button className="p-4 rounded-xl border border-surface-200 hover:border-primary-300 hover:bg-primary-50 transition-all text-left group">
              <BarChart2 className="w-6 h-6 text-primary-600 group-hover:scale-110 transition-transform" />
              <h3 className="mt-2 font-medium text-surface-900">View Analytics</h3>
              <p className="text-xs text-surface-500 mt-1">Compare algorithms</p>
            </button>
            <button className="p-4 rounded-xl border border-surface-200 hover:border-primary-300 hover:bg-primary-50 transition-all text-left group">
              <Settings className="w-6 h-6 text-primary-600 group-hover:scale-110 transition-transform" />
              <h3 className="mt-2 font-medium text-surface-900">Configure</h3>
              <p className="text-xs text-surface-500 mt-1">Adjust settings</p>
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}
