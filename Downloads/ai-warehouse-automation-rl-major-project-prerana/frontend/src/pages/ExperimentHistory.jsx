import { useState } from 'react'
import {
  Download,
  Eye,
  Trash2,
  Filter,
  Search,
  ChevronDown,
  Calendar,
  Database,
  FileJson,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Brain,
  BarChart,
  Zap,
  MoreHorizontal,
} from 'lucide-react'
import { Card } from '../components/Card'

const mockEpisodes = [
  { id: 'default_astar_seed1000', scenario: 'Default', controller: 'A*', seed: 1000, date: '2024-01-15 08:30:00', frames: 45, success: true, steps: 42, collisions: 0, energy: 23.4, duration: '45s' },
  { id: 'default_bfs_seed1000', scenario: 'Default', controller: 'BFS', seed: 1000, date: '2024-01-15 08:31:00', frames: 58, success: true, steps: 58, collisions: 2, energy: 31.2, duration: '58s' },
  { id: 'default_ppo_seed1000', scenario: 'Default', controller: 'PPO', seed: 1000, date: '2024-01-15 08:32:00', frames: 48, success: true, steps: 45, collisions: 1, energy: 25.1, duration: '48s' },
  { id: 'default_random_seed1000', scenario: 'Default', controller: 'Random', seed: 1000, date: '2024-01-15 08:33:00', frames: 200, success: false, steps: 200, collisions: 25, energy: 65.8, duration: '200s' },
  { id: 'simple_static_astar_seed1000', scenario: 'Simple Static', controller: 'A*', seed: 1000, date: '2024-01-15 09:00:00', frames: 38, success: true, steps: 35, collisions: 0, energy: 18.2, duration: '38s' },
  { id: 'complex_static_astar_seed1000', scenario: 'Complex Static', controller: 'A*', seed: 1000, date: '2024-01-15 09:30:00', frames: 67, success: true, steps: 62, collisions: 1, energy: 34.5, duration: '67s' },
  { id: 'dynamic_obstacles_astar_seed1000', scenario: 'Dynamic Obstacles', controller: 'A*', seed: 1000, date: '2024-01-15 10:00:00', frames: 89, success: true, steps: 85, collisions: 3, energy: 42.1, duration: '89s' },
  { id: 'battery_constrained_astar_seed1000', scenario: 'Battery Constrained', controller: 'A*', seed: 1000, date: '2024-01-15 10:30:00', frames: 112, success: true, steps: 108, collisions: 2, energy: 55.3, duration: '112s' },
  { id: 'battery_constrained_ppo_seed1000', scenario: 'Battery Constrained', controller: 'PPO', seed: 1000, date: '2024-01-15 10:31:00', frames: 95, success: true, steps: 91, collisions: 1, energy: 48.7, duration: '95s' },
  { id: 'battery_constrained_bfs_seed1000', scenario: 'Battery Constrained', controller: 'BFS', seed: 1000, date: '2024-01-15 10:32:00', frames: 145, success: true, steps: 140, collisions: 4, energy: 62.1, duration: '145s' },
  { id: 'battery_constrained_random_seed1000', scenario: 'Battery Constrained', controller: 'Random', seed: 1000, date: '2024-01-15 10:33:00', frames: 300, success: false, steps: 300, collisions: 45, energy: 89.2, duration: '300s' },
]

const mockResults = [
  { id: 'default_ppo_vs_baselines', scenario: 'Default', date: '2024-01-15 08:35:00', episodes: 100, algorithms: 4, status: 'completed' },
  { id: 'simple_static_baselines', scenario: 'Simple Static', date: '2024-01-15 09:05:00', episodes: 50, algorithms: 3, status: 'completed' },
  { id: 'complex_static_baselines', scenario: 'Complex Static', date: '2024-01-15 09:35:00', episodes: 50, algorithms: 3, status: 'completed' },
  { id: 'dynamic_obstacles_ppo_vs_baselines', scenario: 'Dynamic Obstacles', date: '2024-01-15 10:05:00', episodes: 100, algorithms: 4, status: 'completed' },
  { id: 'battery_constrained_ppo_vs_baselines', scenario: 'Battery Constrained', date: '2024-01-15 10:35:00', episodes: 100, algorithms: 4, status: 'completed' },
]

export function ExperimentHistory() {
  const [tab, setTab] = useState('episodes')
  const [searchQuery, setSearchQuery] = useState('')
  const [scenarioFilter, setScenarioFilter] = useState('all')
  const [controllerFilter, setControllerFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedItems, setSelectedItems] = useState([])
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')

  const scenarios = [...new Set(mockEpisodes.map(e => e.scenario))]
  const controllers = [...new Set(mockEpisodes.map(e => e.controller))]

  const filteredEpisodes = mockEpisodes
    .filter(ep => {
      const matchesSearch = ep.id.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesScenario = scenarioFilter === 'all' || ep.scenario === scenarioFilter
      const matchesController = controllerFilter === 'all' || ep.controller === controllerFilter
      const matchesStatus = statusFilter === 'all' || (statusFilter === 'success' && ep.success) || (statusFilter === 'failed' && !ep.success)
      return matchesSearch && matchesScenario && matchesController && matchesStatus
    })
    .sort((a, b) => {
      let valA = a[sortBy]
      let valB = b[sortBy]
      if (typeof valA === 'string') valA = valA.toLowerCase()
      if (typeof valB === 'string') valB = valB.toLowerCase()
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

  const filteredResults = mockResults
    .filter(res => {
      const matchesSearch = res.id.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesScenario = scenarioFilter === 'all' || res.scenario === scenarioFilter
      return matchesSearch && matchesScenario
    })
    .sort((a, b) => {
      let valA = a[sortBy]
      let valB = b[sortBy]
      if (typeof valA === 'string') valA = valA.toLowerCase()
      if (typeof valB === 'string') valB = valB.toLowerCase()
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const getSortIcon = (field) => {
    if (sortBy !== field) return <ChevronDown className="w-4 h-4 text-surface-400" />
    return sortOrder === 'asc' ? (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
    ) : (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
    )
  }

  const toggleSelect = (id) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const selectAll = () => {
    if (selectedItems.length === (tab === 'episodes' ? filteredEpisodes.length : filteredResults.length)) {
      setSelectedItems([])
    } else {
      setSelectedItems(tab === 'episodes' ? filteredEpisodes.map(e => e.id) : filteredResults.map(r => r.id))
    }
  }

  const exportSelected = () => {
    const data = tab === 'episodes'
      ? mockEpisodes.filter(e => selectedItems.includes(e.id))
      : mockResults.filter(r => selectedItems.includes(r.id))
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${tab}_export_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Experiment History</h1>
          <p className="text-surface-500 mt-1">Browse and manage recorded simulations and evaluations</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedItems.length > 0 && (
            <>
              <button className="btn-secondary" onClick={exportSelected}>
                <Download className="w-4 h-4" />
                Export Selected ({selectedItems.length})
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab('episodes')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === 'episodes'
              ? 'bg-primary-600 text-white'
              : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
          }`}
        >
          <Brain className="w-4 h-4 inline mr-2" />
          Episodes ({mockEpisodes.length})
        </button>
        <button
          onClick={() => setTab('results')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === 'results'
              ? 'bg-primary-600 text-white'
              : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
          }`}
        >
          <BarChart className="w-4 h-4 inline mr-2" />
          Evaluations ({mockResults.length})
        </button>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-4 mb-4 p-4 bg-surface-50 rounded-xl">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              placeholder="Search experiments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-4 h-4 text-surface-400" />
            <select value={scenarioFilter} onChange={(e) => setScenarioFilter(e.target.value)} className="select py-2 px-3">
              <option value="all">All Scenarios</option>
              {scenarios.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {tab === 'episodes' && (
              <>
                <select value={controllerFilter} onChange={(e) => setControllerFilter(e.target.value)} className="select py-2 px-3">
                  <option value="all">All Algorithms</option>
                  {controllers.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="select py-2 px-3">
                  <option value="all">All Status</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                </select>
              </>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200 text-left text-sm font-medium text-surface-500">
                <th className="pb-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedItems.length > 0 && selectedItems.length === (tab === 'episodes' ? filteredEpisodes.length : filteredResults.length)}
                    onChange={selectAll}
                    className="rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                    aria-label="Select all"
                  />
                </th>
                {tab === 'episodes' ? (
                  <>
                    <th className="pb-3 px-4 cursor-pointer hover:text-surface-700" onClick={() => handleSort('id')}>
                      Episode ID {getSortIcon('id')}
                    </th>
                    <th className="pb-3 px-4 cursor-pointer hover:text-surface-700" onClick={() => handleSort('scenario')}>
                      Scenario {getSortIcon('scenario')}
                    </th>
                    <th className="pb-3 px-4 cursor-pointer hover:text-surface-700" onClick={() => handleSort('controller')}>
                      Algorithm {getSortIcon('controller')}
                    </th>
                    <th className="pb-3 px-4 cursor-pointer hover:text-surface-700" onClick={() => handleSort('seed')}>
                      Seed {getSortIcon('seed')}
                    </th>
                    <th className="pb-3 px-4 cursor-pointer hover:text-surface-700" onClick={() => handleSort('date')}>
                      Date {getSortIcon('date')}
                    </th>
                    <th className="pb-3 px-4 cursor-pointer hover:text-surface-700" onClick={() => handleSort('frames')}>
                      Frames {getSortIcon('frames')}
                    </th>
                    <th className="pb-3 px-4">Status</th>
                    <th className="pb-3 px-4 cursor-pointer hover:text-surface-700" onClick={() => handleSort('steps')}>
                      Steps {getSortIcon('steps')}
                    </th>
                    <th className="pb-3 px-4 cursor-pointer hover:text-surface-700" onClick={() => handleSort('collisions')}>
                      Collisions {getSortIcon('collisions')}
                    </th>
                    <th className="pb-3 px-4 cursor-pointer hover:text-surface-700" onClick={() => handleSort('energy')}>
                      Energy % {getSortIcon('energy')}
                    </th>
                    <th className="pb-3 px-4 cursor-pointer hover:text-surface-700" onClick={() => handleSort('duration')}>
                      Duration {getSortIcon('duration')}
                    </th>
                    <th className="pb-3 px-4">Actions</th>
                  </>
                ) : (
                  <>
                    <th className="pb-3 px-4 cursor-pointer hover:text-surface-700" onClick={() => handleSort('id')}>
                      Evaluation ID {getSortIcon('id')}
                    </th>
                    <th className="pb-3 px-4 cursor-pointer hover:text-surface-700" onClick={() => handleSort('scenario')}>
                      Scenario {getSortIcon('scenario')}
                    </th>
                    <th className="pb-3 px-4 cursor-pointer hover:text-surface-700" onClick={() => handleSort('date')}>
                      Date {getSortIcon('date')}
                    </th>
                    <th className="pb-3 px-4 cursor-pointer hover:text-surface-700" onClick={() => handleSort('episodes')}>
                      Episodes {getSortIcon('episodes')}
                    </th>
                    <th className="pb-3 px-4 cursor-pointer hover:text-surface-700" onClick={() => handleSort('algorithms')}>
                      Algorithms {getSortIcon('algorithms')}
                    </th>
                    <th className="pb-3 px-4">Status</th>
                    <th className="pb-3 px-4">Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {(tab === 'episodes' ? filteredEpisodes : filteredResults).map(item => (
                <tr key={item.id} className={`border-b border-surface-100 hover:bg-surface-50 ${selectedItems.includes(item.id) ? 'bg-primary-50' : ''}`}>
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      className="rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                  {tab === 'episodes' ? (
                    <>
                      <td className="py-3 px-4 font-mono text-sm text-surface-900">{item.id}</td>
                      <td className="py-3 px-4">
                        <span className="badge badge-info">{item.scenario}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`badge ${item.controller === 'PPO' || item.controller === 'DQN' || item.controller === 'Q-Learning' ? 'badge-purple' : item.controller === 'Random' ? 'badge-neutral' : 'badge-blue'}`}>
                          {item.controller}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-surface-600 font-mono">{item.seed}</td>
                      <td className="py-3 px-4 text-surface-600 font-mono">{item.date}</td>
                      <td className="py-3 px-4 text-surface-600">{item.frames}</td>
                      <td className="py-3 px-4">
                        {item.success ? (
                          <span className="badge badge-success flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Success
                          </span>
                        ) : (
                          <span className="badge badge-danger flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            Failed
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-surface-600">{item.steps}</td>
                      <td className="py-3 px-4 font-mono text-surface-600">{item.collisions}</td>
                      <td className="py-3 px-4 font-mono text-surface-600">{item.energy}%</td>
                      <td className="py-3 px-4 font-mono text-surface-600">{item.duration}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 rounded hover:bg-surface-100 text-surface-400 hover:text-surface-600" aria-label="View replay">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 rounded hover:bg-surface-100 text-surface-400 hover:text-surface-600" aria-label="Download">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 px-4 font-mono text-sm text-surface-900">{item.id}</td>
                      <td className="py-3 px-4">
                        <span className="badge badge-info">{item.scenario}</span>
                      </td>
                      <td className="py-3 px-4 text-surface-600 font-mono">{item.date}</td>
                      <td className="py-3 px-4 text-surface-600">{item.episodes}</td>
                      <td className="py-3 px-4 text-surface-600">{item.algorithms}</td>
                      <td className="py-3 px-4">
                        <span className={`badge ${item.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 rounded hover:bg-surface-100 text-surface-400 hover:text-surface-600" aria-label="View report">
                            <FileText className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 rounded hover:bg-surface-100 text-surface-400 hover:text-surface-600" aria-label="Download JSON">
                            <FileJson className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(tab === 'episodes' ? filteredEpisodes : filteredResults).length === 0 && (
          <div className="text-center py-12 text-surface-500">
            <Database className="w-12 h-12 mx-auto mb-4 text-surface-300" />
            <p>No experiments match your filters</p>
          </div>
        )}
      </Card>
    </div>
  )
}