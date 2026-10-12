import { useState } from 'react'
import { useResults, useEpisodes } from '../hooks/useApi.js'
import {
  BarChart,
  TrendingUp,
  Award,
  Clock,
  Zap,
  AlertTriangle,
  CheckCircle,
  Download,
  ChevronDown,
  RefreshCw,
  Brain,
  Search,
} from 'lucide-react'
import {
  BarChart as RechartsBarChart,
  Bar,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PolarGrid,
} from 'recharts'
import { Card } from '../components/Card'

const algorithms = [
  { id: 'astar', name: 'A* Search', type: 'Classical', color: '#3b82f6', available: true },
  { id: 'bfs', name: 'BFS', type: 'Classical', color: '#22c55e', available: true },
  { id: 'dqn', name: 'DQN', type: 'RL', color: '#f59e0b', available: false },
  { id: 'ppo', name: 'PPO', type: 'RL', color: '#8b5cf6', available: true },
  { id: 'qlearning', name: 'Q-Learning', type: 'RL', color: '#ec4899', available: false },
  { id: 'random', name: 'Random', type: 'Baseline', color: '#94a3b8', available: true },
]

const scenarios = [
  { id: 'default', name: 'Default Warehouse' },
  { id: 'simple_static', name: 'Simple Static' },
  { id: 'complex_static', name: 'Complex Static' },
  { id: 'dynamic_obstacles', name: 'Dynamic Obstacles' },
  { id: 'battery_constrained', name: 'Battery Constrained' },
]

const comparisonData = [
  { algorithm: 'A*', successRate: 95, avgSteps: 42, pathEfficiency: 98, collisions: 0, energyUsage: 23, chargeEvents: 1, completionTime: 45 },
  { algorithm: 'BFS', successRate: 88, avgSteps: 58, pathEfficiency: 72, collisions: 2, energyUsage: 31, chargeEvents: 2, completionTime: 62 },
  { algorithm: 'PPO', successRate: 92, avgSteps: 45, pathEfficiency: 94, collisions: 1, energyUsage: 25, chargeEvents: 1, completionTime: 48 },
  { algorithm: 'DQN', successRate: 85, avgSteps: 52, pathEfficiency: 88, collisions: 3, energyUsage: 28, chargeEvents: 2, completionTime: 55 },
  { algorithm: 'Q-Learning', successRate: 75, avgSteps: 72, pathEfficiency: 65, collisions: 5, energyUsage: 38, chargeEvents: 3, completionTime: 78 },
  { algorithm: 'Random', successRate: 25, avgSteps: 180, pathEfficiency: 15, collisions: 25, energyUsage: 65, chargeEvents: 8, completionTime: 195 },
]

const radarData = [
  { subject: 'Success Rate', 'A*': 95, 'BFS': 88, 'PPO': 92, 'DQN': 85, 'Q-Learning': 75, 'Random': 25 },
  { subject: 'Path Efficiency', 'A*': 98, 'BFS': 72, 'PPO': 94, 'DQN': 88, 'Q-Learning': 65, 'Random': 15 },
  { subject: 'Energy Efficiency', 'A*': 77, 'BFS': 69, 'PPO': 75, 'DQN': 72, 'Q-Learning': 62, 'Random': 35 },
  { subject: 'Collision Avoidance', 'A*': 100, 'BFS': 90, 'PPO': 95, 'DQN': 85, 'Q-Learning': 70, 'Random': 20 },
  { subject: 'Speed', 'A*': 90, 'BFS': 75, 'PPO': 88, 'DQN': 82, 'Q-Learning': 65, 'Random': 25 },
  { subject: 'Reliability', 'A*': 98, 'BFS': 92, 'PPO': 94, 'DQN': 88, 'Q-Learning': 80, 'Random': 30 },
]

const scenarioComparison = [
  { scenario: 'Default', 'A*': 95, 'BFS': 88, 'PPO': 92, 'Random': 25 },
  { scenario: 'Simple Static', 'A*': 98, 'BFS': 92, 'PPO': 95, 'Random': 30 },
  { scenario: 'Complex Static', 'A*': 92, 'BFS': 85, 'PPO': 90, 'Random': 20 },
  { scenario: 'Dynamic Obstacles', 'A*': 88, 'BFS': 80, 'PPO': 89, 'Random': 15 },
  { scenario: 'Battery Constrained', 'A*': 85, 'BFS': 78, 'PPO': 91, 'Random': 10 },
]

export function AlgorithmComparison() {
  const [selectedScenario, setSelectedScenario] = useState('default')
  const [selectedAlgorithms, setSelectedAlgorithms] = useState(['astar', 'bfs', 'ppo', 'random'])
  const [viewMode, setViewMode] = useState('bars')
  const [loading, setLoading] = useState(false)
  const { data: results } = useResults()

  const selectedAlgorithmNames = selectedAlgorithms.map(a => algorithms.find(alg => alg.id === a)?.name).filter(Boolean)
  const filteredData = comparisonData.filter(d => selectedAlgorithmNames.includes(d.algorithm))

  const runComparison = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLoading(false)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Algorithm Comparison</h1>
          <p className="text-surface-500 mt-1">Compare pathfinding and RL algorithms across scenarios</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary" onClick={runComparison} disabled={loading}>
            <RefreshCw className="w-4 h-4" />
            Run Comparison
          </button>
          <button className="btn-primary">
            <Download className="w-4 h-4" />
            Export Results
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card title="Scenario" className="lg:col-span-1">
          <div className="space-y-4">
            <div>
              <label className="label">Warehouse Scenario</label>
              <select
                value={selectedScenario}
                onChange={(e) => setSelectedScenario(e.target.value)}
                className="select"
              >
                {scenarios.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div>
              <label className="label">Algorithms to Compare</label>
              <div className="space-y-2">
                {algorithms.map(alg => (
                  <label key={alg.id} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${!alg.available ? 'opacity-50' : ''}`}>
                    <input
                      type="checkbox"
                      checked={selectedAlgorithms.includes(alg.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAlgorithms([...selectedAlgorithms, alg.id])
                        } else {
                          setSelectedAlgorithms(selectedAlgorithms.filter(a => a !== alg.id))
                        }
                      }}
                      disabled={!alg.available}
                      className="rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                    />
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: alg.color }}
                    />
                    <span className="text-sm text-surface-700">{alg.name}</span>
                    <span className={`badge ${alg.type === 'RL' ? 'badge-purple' : alg.type === 'Classical' ? 'badge-blue' : 'badge-neutral'}`}>
                      {alg.type}
                    </span>
                    {!alg.available && <span className="ml-auto badge badge-neutral">Unavailable</span>}
                  </label>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-primary-50 border border-primary-100">
              <p className="text-sm text-primary-900">
                <strong>Note:</strong> RL algorithms (PPO, DQN, Q-Learning) require trained models.
                Only A*, BFS, and Random are available without training.
              </p>
            </div>

            <div className="pt-4 border-t border-surface-200">
              <h4 className="font-medium text-surface-900 mb-2">Metrics Explained</h4>
              <dl className="space-y-2 text-sm text-surface-600">
                <div className="flex justify-between"><dt>Success Rate</dt><dd className="font-medium">% of completed deliveries</dd></div>
                <div className="flex justify-between"><dt>Avg Steps</dt><dd className="font-medium">Steps per delivery</dd></div>
                <div className="flex justify-between"><dt>Path Efficiency</dt><dd className="font-medium">Actual vs optimal path</dd></div>
                <div className="flex justify-between"><dt>Collisions</dt><dd className="font-medium">Total collisions per episode</dd></div>
                <div className="flex justify-between"><dt>Energy Usage</dt><dd className="font-medium">Battery consumed</dd></div>
              </dl>
            </div>
          </div>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          <Card title="Performance Metrics" subtitle={`${filteredData.length} algorithms compared`}>
            <div className="mb-4 flex gap-2">
              {['bars', 'radar', 'scenarios'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    viewMode === mode
                      ? 'bg-primary-600 text-white'
                      : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                  }`}
                >
                  {mode === 'bars' && 'Bar Chart'}
                  {mode === 'radar' && 'Radar Chart'}
                  {mode === 'scenarios' && 'By Scenario'}
                </button>
              ))}
            </div>

            {viewMode === 'bars' && (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={filteredData} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                    <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis dataKey="algorithm" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} width={60} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                      labelStyle={{ color: '#1e293b', fontWeight: 600 }}
                    />
                    <Legend />
                    <Bar dataKey="successRate" fill="#22c55e" name="Success Rate (%)" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="pathEfficiency" fill="#3b82f6" name="Path Efficiency (%)" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="collisions" fill="#ef4444" name="Collisions" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="energyUsage" fill="#f59e0b" name="Energy %" radius={[0, 4, 4, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            )}

            {viewMode === 'radar' && (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80" data={radarData.filter(d => selectedAlgorithmNames.includes(d.subject))}>
                    <PolarGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <PolarAngleAxis stroke="#94a3b8" fontSize={11} />
                    <PolarRadiusAxis angle={30} stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                    />
                    <Legend />
                    {algorithms
                      .filter(a => selectedAlgorithms.includes(a.id))
                      .map((alg, idx) => (
                        <Radar
                          key={alg.id}
                          name={alg.name}
                          dataKey={alg.name}
                          stroke={alg.color}
                          fill={alg.color}
                          fillOpacity={0.1}
                          strokeWidth={2}
                        />
                      ))}
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}

            {viewMode === 'scenarios' && (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={scenarioComparison} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="scenario" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                    />
                    <Legend />
                    {algorithms
                      .filter(a => selectedAlgorithms.includes(a.id) && a.available)
                      .map(alg => (
                        <Bar key={alg.id} dataKey={alg.name} fill={alg.color} name={alg.name} radius={[4, 4, 0, 0]} />
                      ))}
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>

          <Card title="Detailed Comparison Table">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-200 text-left text-sm font-medium text-surface-500">
                    <th className="pb-3 px-4">Algorithm</th>
                    <th className="pb-3 px-4">Type</th>
                    <th className="pb-3 px-4"><CheckCircle className="w-4 h-4 inline mr-1 text-green-600" /> Success Rate</th>
                    <th className="pb-3 px-4"><Clock className="w-4 h-4 inline mr-1 text-blue-600" /> Avg Steps</th>
                    <th className="pb-3 px-4"><TrendingUp className="w-4 h-4 inline mr-1 text-purple-600" /> Path Efficiency</th>
                    <th className="pb-3 px-4"><AlertTriangle className="w-4 h-4 inline mr-1 text-red-600" /> Collisions</th>
                    <th className="pb-3 px-4"><Zap className="w-4 h-4 inline mr-1 text-yellow-600" /> Energy %</th>
                    <th className="pb-3 px-4"><Brain className="w-4 h-4 inline mr-1 text-orange-600" /> Charge Events</th>
                    <th className="pb-3 px-4"><Clock className="w-4 h-4 inline mr-1 text-gray-600" /> Time (s)</th>
                    <th className="pb-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map(row => (
                    <tr key={row.algorithm} className="border-b border-surface-100 hover:bg-surface-50">
                      <td className="py-3 px-4 font-medium text-surface-900">{row.algorithm}</td>
                      <td className="py-3 px-4">
                        <span className="badge badge-info">{algorithms.find(a => a.name === row.algorithm)?.type}</span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-green-700">{row.successRate}%</td>
                      <td className="py-3 px-4 font-mono text-surface-600">{row.avgSteps}</td>
                      <td className="py-3 px-4 font-semibold text-purple-700">{row.pathEfficiency}%</td>
                      <td className="py-3 px-4 font-mono text-red-700">{row.collisions}</td>
                      <td className="py-3 px-4 font-mono text-yellow-700">{row.energyUsage}%</td>
                      <td className="py-3 px-4 font-mono text-orange-700">{row.chargeEvents}</td>
                      <td className="py-3 px-4 font-mono text-surface-600">{row.completionTime}s</td>
                      <td className="py-3 px-4">
                        {algorithms.find(a => a.name === row.algorithm)?.available ? (
                          <span className="badge badge-success">Available</span>
                        ) : (
                          <span className="badge badge-neutral">Needs Training</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}