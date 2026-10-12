import { useState } from 'react'
import { useEpisodes, useResults } from '../hooks/useApi.js'
import {
  BarChart,
  LineChart,
  PieChart,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  Zap,
  Clock,
  TrendingDown,
} from 'lucide-react'
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadarChart,
  Radar,
} from 'recharts'
import { Card } from '../components/Card'

const timeRangeData = [
  { date: 'Jan 1', success: 85, efficiency: 78, collisions: 12, energy: 45, tasks: 120 },
  { date: 'Jan 8', success: 88, efficiency: 82, collisions: 8, energy: 42, tasks: 135 },
  { date: 'Jan 15', success: 90, efficiency: 85, collisions: 6, energy: 40, tasks: 142 },
  { date: 'Jan 22', success: 92, efficiency: 88, collisions: 4, energy: 38, tasks: 150 },
  { date: 'Jan 29', success: 94, efficiency: 90, collisions: 3, energy: 35, tasks: 158 },
  { date: 'Feb 5', success: 93, efficiency: 89, collisions: 4, energy: 36, tasks: 155 },
  { date: 'Feb 12', success: 95, efficiency: 91, collisions: 2, energy: 34, tasks: 165 },
]

const algorithmMetrics = [
  { metric: 'Success Rate', AStar: 95, BFS: 88, PPO: 92, DQN: 85, QLearning: 75, Random: 25 },
  { metric: 'Path Efficiency', AStar: 98, BFS: 72, PPO: 94, DQN: 88, QLearning: 65, Random: 15 },
  { metric: 'Energy Efficiency', AStar: 77, BFS: 69, PPO: 75, DQN: 72, QLearning: 62, Random: 35 },
  { metric: 'Collision Avoidance', AStar: 100, BFS: 90, PPO: 95, DQN: 85, QLearning: 70, Random: 20 },
  { metric: 'Speed', AStar: 90, BFS: 75, PPO: 88, DQN: 82, QLearning: 65, Random: 25 },
  { metric: 'Reliability', AStar: 98, BFS: 92, PPO: 94, DQN: 88, QLearning: 80, Random: 30 },
]

const collisionData = [
  { type: 'Static', count: 45, percentage: 60 },
  { type: 'Dynamic', count: 18, percentage: 24 },
  { type: 'Robot-Robot', count: 12, percentage: 16 },
]

const energyData = [
  { hour: '0h', avg: 100, min: 95, max: 100 },
  { hour: '1h', avg: 92, min: 85, max: 98 },
  { hour: '2h', avg: 84, min: 75, max: 90 },
  { hour: '3h', avg: 76, min: 65, max: 82 },
  { hour: '4h', avg: 68, min: 55, max: 75 },
  { hour: '5h', avg: 60, min: 45, max: 68 },
  { hour: '6h', avg: 52, min: 35, max: 60 },
  { hour: '7h', avg: 44, min: 28, max: 52 },
  { hour: '8h', avg: 36, min: 20, max: 44 },
  { hour: '9h', avg: 28, min: 15, max: 36 },
  { hour: '10h', avg: 20, min: 10, max: 28 },
  { hour: '11h', avg: 15, min: 5, max: 22 },
  { hour: '12h', avg: 10, min: 2, max: 15 },
]

const taskOutcomes = [
  { outcome: 'Completed', count: 1247, percentage: 89 },
  { outcome: 'Failed - Timeout', count: 67, percentage: 5 },
  { outcome: 'Failed - Collision', count: 45, percentage: 3 },
  { outcome: 'Failed - Battery', count: 28, percentage: 2 },
  { outcome: 'Failed - Other', count: 15, percentage: 1 },
]

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4']

export function Analytics() {
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedMetric, setSelectedMetric] = useState('success')
  const { data: episodes } = useEpisodes()
  const { data: results } = useResults()

  const totalEpisodes = episodes?.length || 0
  const successfulEpisodes = episodes?.filter(e => e.summary.success).length || 0
  const successRate = totalEpisodes > 0 ? ((successfulEpisodes / totalEpisodes) * 100).toFixed(1) : 0
  const avgSteps = episodes?.length > 0
    ? Math.round(episodes.reduce((sum, e) => sum + e.summary.steps, 0) / episodes.length)
    : 0
  const avgEnergy = episodes?.length > 0
    ? (episodes.reduce((sum, e) => sum + e.summary.energy_consumed, 0) / episodes.length).toFixed(1)
    : 0
  const totalCollisions = episodes?.reduce((sum, e) => sum + e.summary.collisions, 0) || 0

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Analytics</h1>
          <p className="text-surface-500 mt-1">Deep dive into warehouse performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-surface-400" />
            <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="select py-2 px-3 text-sm">
              <option value="1d">Last 24h</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
          <button className="btn-secondary">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Success Rate"
          value={`${successRate}%`}
          change="+2.1% vs last period"
          trend="up"
          icon={CheckCircle}
          color="green"
        />
        <MetricCard
          label="Avg Steps/Delivery"
          value={avgSteps.toString()}
          change="-3 steps vs last period"
          trend="down"
          icon={TrendingDown}
          color="blue"
        />
        <MetricCard
          label="Avg Energy Used"
          value={`${avgEnergy}%`}
          change="-1.2% vs last period"
          trend="down"
          icon={Zap}
          color="yellow"
        />
        <MetricCard
          label="Total Collisions"
          value={totalCollisions.toString()}
          change="-5 vs last period"
          trend="down"
          icon={AlertTriangle}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Performance Trends" subtitle="Key metrics over time">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={timeRangeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 200]} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="success" stroke="#22c55e" fill="#22c55e" fillOpacity={0.1} name="Success Rate (%)" />
                <Area yAxisId="left" type="monotone" dataKey="efficiency" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} name="Path Efficiency (%)" />
                <Line yAxisId="right" type="monotone" dataKey="tasks" stroke="#f59e0b" strokeWidth={2} dot={false} name="Tasks Completed" strokeDasharray="5 5" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Collision & Energy Analysis" subtitle="Breakdown of collision types and energy trends">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-surface-900 mb-4">Collision Types</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={collisionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="count"
                      nameKey="type"
                      label={({ type, percentage }) => `${type} ${(percentage * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {collisionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                      formatter={(value) => [value, 'collisions']}
                    />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-surface-900 mb-4">Energy Drain Pattern</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={energyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="hour" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 110]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="avg" stroke="#3b82f6" strokeWidth={2} dot={false} name="Average" />
                    <Line type="monotone" dataKey="min" stroke="#94a3b8" strokeWidth={1} dot={false} name="Min" strokeDasharray="3 3" />
                    <Line type="monotone" dataKey="max" stroke="#94a3b8" strokeWidth={1} dot={false} name="Max" strokeDasharray="3 3" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Algorithm Metrics Comparison" subtitle="Radar chart showing multi-dimensional performance">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChartWrapper data={algorithmMetrics} />
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Task Outcomes" subtitle="Delivery success and failure breakdown">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={taskOutcomes}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="outcome"
                  label={({ outcome, percentage }) => `${outcome} ${(percentage * 100).toFixed(1)}%`}
                  labelLine={false}
                >
                  {taskOutcomes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#22c55e' : COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  formatter={(value) => [value, 'tasks']}
                />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Algorithm Performance Bars" subtitle="Side-by-side metric comparison">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={algorithmMetrics} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <YAxis dataKey="metric" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} width={140} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="AStar" fill="#3b82f6" name="A*" radius={[0, 4, 4, 0]} />
                <Bar dataKey="BFS" fill="#22c55e" name="BFS" radius={[0, 4, 4, 0]} />
                <Bar dataKey="PPO" fill="#8b5cf6" name="PPO" radius={[0, 4, 4, 0]} />
                <Bar dataKey="DQN" fill="#f59e0b" name="DQN" radius={[0, 4, 4, 0]} />
                <Bar dataKey="QLearning" fill="#ec4899" name="Q-Learning" radius={[0, 4, 4, 0]} />
                <Bar dataKey="Random" fill="#94a3b8" name="Random" radius={[0, 4, 4, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Key Insights" subtitle="Automated analysis of performance data">
          <div className="space-y-4">
            <InsightCard
              icon={TrendingUp}
              color="green"
              title="Success Rate Improving"
              description="Overall success rate has increased 8.2% over the last 30 days, driven by better path planning in PPO."
            />
            <InsightCard
              icon={Zap}
              color="yellow"
              title="Energy Optimization Opportunity"
              description="Robots consume 23% more energy during peak hours (10am-2pm). Consider scheduling non-urgent tasks off-peak."
            />
            <InsightCard
              icon={AlertTriangle}
              color="red"
              title="Collision Hotspot Identified"
              description="Sector C3-D4 accounts for 40% of static collisions. Recommend adding pathway markers."
            />
            <InsightCard
              icon={Clock}
              color="blue"
              title="PPO Outperforms Classical"
              description="PPO reduces average steps by 12% vs A* in dynamic environments, but requires 3x compute."
            />
          </div>
        </Card>
      </div>
    </div>
  )
}

function MetricCard({ label, value, change, trend, icon: Icon, color }) {
  const COLOR_MAP = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  }

  return (
    <div className="stat-card">
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
      <div className="mt-4 flex items-center gap-1">
        {trend === 'up' ? (
          <TrendingUp className="w-4 h-4 text-green-600" />
        ) : (
          <TrendingDown className="w-4 h-4 text-red-600" />
        )}
        <span className={`text-xs font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {trend === 'up' ? 'Improving' : 'Declining'}
        </span>
      </div>
    </div>
  )
}

function RadarChartWrapper({ data }) {
  return (
    <>
      <PolarGrid strokeDasharray="3 3" stroke="#e2e8f0" />
      <PolarAngleAxis stroke="#94a3b8" fontSize={11} />
      <PolarRadiusAxis angle={30} stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
      <Tooltip
        contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
      />
      <Legend />
      {['AStar', 'BFS', 'PPO', 'DQN', 'QLearning', 'Random'].map((key, idx) => (
        <Radar
          key={key}
          name={key.replace('AStar', 'A*').replace('QLearning', 'Q-Learning')}
          dataKey={key}
          stroke={COLORS[idx]}
          fill={COLORS[idx]}
          fillOpacity={0.1}
          strokeWidth={2}
        />
      ))}
    </>
  )
}

function InsightCard({ icon: Icon, color, title, description }) {
  const COLOR_MAP = {
    blue: 'bg-blue-50 text-blue-900 border-blue-200',
    green: 'bg-green-50 text-green-900 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-900 border-yellow-200',
    red: 'bg-red-50 text-red-900 border-red-200',
  }

  const ICON_COLOR_MAP = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
  }

  return (
    <div className={`p-4 rounded-xl border ${COLOR_MAP[color]}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${ICON_COLOR_MAP[color]} bg-white/50`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm mt-1 opacity-80">{description}</p>
        </div>
      </div>
    </div>
  )
}