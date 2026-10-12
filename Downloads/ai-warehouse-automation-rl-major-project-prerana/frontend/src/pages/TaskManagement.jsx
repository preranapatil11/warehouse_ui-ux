import { useState } from 'react'
import { useEpisodes, useResults } from '../hooks/useApi.js'
import {
  ClipboardList,
  Plus,
  Filter,
  Search,
  Download,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Package,
  ArrowUpDown,
  MoreHorizontal,
  ChevronDown,
} from 'lucide-react'
import { Card } from '../components/Card'
import { StatCard } from '../components/StatCard'

const TASK_STATUS = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  assigned: { label: 'Assigned', color: 'bg-blue-100 text-blue-800', icon: MapPin },
  in_progress: { label: 'In Progress', color: 'bg-purple-100 text-purple-800', icon: Package },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  failed: { label: 'Failed', color: 'bg-red-100 text-red-800', icon: XCircle },
}

const mockTasks = [
  { id: 'TSK-001', type: 'Pickup', from: 'Storage A1', to: 'Packing Station 1', priority: 'High', status: 'in_progress', assignedRobot: 'robot_1', createdAt: '2024-01-15 08:30', estimatedTime: '5 min' },
  { id: 'TSK-002', type: 'Delivery', from: 'Packing Station 1', to: 'Exit Gate B', priority: 'High', status: 'assigned', assignedRobot: 'robot_2', createdAt: '2024-01-15 08:35', estimatedTime: '3 min' },
  { id: 'TSK-003', type: 'Restock', from: 'Entry Gate A', to: 'Shelf C3', priority: 'Medium', status: 'pending', assignedRobot: null, createdAt: '2024-01-15 08:40', estimatedTime: '8 min' },
  { id: 'TSK-004', type: 'Pickup', from: 'Storage B2', to: 'Packing Station 2', priority: 'Low', status: 'pending', assignedRobot: null, createdAt: '2024-01-15 08:45', estimatedTime: '6 min' },
  { id: 'TSK-005', type: 'Delivery', from: 'Packing Station 2', to: 'Exit Gate A', priority: 'Medium', status: 'completed', assignedRobot: 'robot_3', createdAt: '2024-01-15 08:20', estimatedTime: '4 min' },
  { id: 'TSK-006', type: 'Charge', from: 'robot_4', to: 'Charging Station 1', priority: 'High', status: 'in_progress', assignedRobot: 'robot_4', createdAt: '2024-01-15 08:50', estimatedTime: '15 min' },
  { id: 'TSK-007', type: 'Pickup', from: 'Storage A3', to: 'Packing Station 1', priority: 'Medium', status: 'pending', assignedRobot: null, createdAt: '2024-01-15 08:55', estimatedTime: '7 min' },
  { id: 'TSK-008', type: 'Restock', from: 'Entry Gate B', to: 'Shelf D1', priority: 'Low', status: 'failed', assignedRobot: 'robot_5', createdAt: '2024-01-15 08:25', estimatedTime: '10 min' },
]

export function TaskManagement() {
  const [tasks] = useState(mockTasks)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [selectedTask, setSelectedTask] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const filteredTasks = tasks
    .filter(task => {
      const matchesSearch = task.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.to.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
      return matchesSearch && matchesStatus && matchesPriority
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

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    failed: tasks.filter(t => t.status === 'failed').length,
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const getSortIcon = (field) => {
    if (sortBy !== field) return <ArrowUpDown className="w-4 h-4 text-surface-400" />
    return sortOrder === 'asc' ? (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
    ) : (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Task Management</h1>
          <p className="text-surface-500 mt-1">Create, assign, and track warehouse delivery tasks</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4" />
            Create Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total Tasks" value={stats.total.toString()} change="All tasks" icon={ClipboardList} color="blue" />
        <StatCard label="Pending" value={stats.pending.toString()} change="Awaiting assignment" icon={Clock} color="yellow" />
        <StatCard label="In Progress" value={stats.inProgress.toString()} change="Active tasks" icon={Package} color="purple" />
        <StatCard label="Completed" value={stats.completed.toString()} change="Done today" icon={CheckCircle} color="green" />
        <StatCard label="Failed" value={stats.failed.toString()} change="Need attention" icon={XCircle} color="red" />
      </div>

      <Card title="Task Queue" subtitle={`${filteredTasks.length} of ${tasks.length} tasks`}>
        <div className="flex flex-col sm:flex-row gap-4 mb-4 p-4 bg-surface-50 rounded-xl">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-surface-400" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="select py-2 px-3">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="select py-2 px-3">
              <option value="all">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200 text-left text-sm font-medium text-surface-500">
                <th className="pb-3 px-4 cursor-pointer hover:text-surface-700" onClick={() => handleSort('id')}>
                  Task ID {getSortIcon('id')}
                </th>
                <th className="pb-3 px-4 cursor-pointer hover:text-surface-700" onClick={() => handleSort('type')}>
                  Type {getSortIcon('type')}
                </th>
                <th className="pb-3 px-4 cursor-pointer hover:text-surface-700" onClick={() => handleSort('priority')}>
                  Priority {getSortIcon('priority')}
                </th>
                <th className="pb-3 px-4 cursor-pointer hover:text-surface-700" onClick={() => handleSort('status')}>
                  Status {getSortIcon('status')}
                </th>
                <th className="pb-3 px-4 cursor-pointer hover:text-surface-700" onClick={() => handleSort('from')}>
                  From {getSortIcon('from')}
                </th>
                <th className="pb-3 px-4 cursor-pointer hover:text-surface-700" onClick={() => handleSort('to')}>
                  To {getSortIcon('to')}
                </th>
                <th className="pb-3 px-4 cursor-pointer hover:text-surface-700" onClick={() => handleSort('assignedRobot')}>
                  Robot {getSortIcon('assignedRobot')}
                </th>
                <th className="pb-3 px-4 cursor-pointer hover:text-surface-700" onClick={() => handleSort('createdAt')}>
                  Created {getSortIcon('createdAt')}
                </th>
                <th className="pb-3 px-4 cursor-pointer hover:text-surface-700" onClick={() => handleSort('estimatedTime')}>
                  Est. Time {getSortIcon('estimatedTime')}
                </th>
                <th className="pb-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map(task => {
                const statusConfig = TASK_STATUS[task.status]
                const StatusIcon = statusConfig.icon
                const priorityColors = {
                  High: 'bg-red-100 text-red-800',
                  Medium: 'bg-yellow-100 text-yellow-800',
                  Low: 'bg-green-100 text-green-800',
                }

                return (
                  <tr key={task.id} className={`border-b border-surface-100 hover:bg-surface-50 ${selectedTask === task.id ? 'bg-primary-50' : ''}`}>
                    <td className="py-3 px-4 font-mono font-medium text-surface-900">{task.id}</td>
                    <td className="py-3 px-4">
                      <span className={`badge ${priorityColors[task.priority]}`}>{task.type}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`badge ${priorityColors[task.priority]}`}>{task.priority}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`badge ${statusConfig.color}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-surface-600">{task.from}</td>
                    <td className="py-3 px-4 text-surface-600">{task.to}</td>
                    <td className="py-3 px-4">
                      {task.assignedRobot ? (
                        <span className="font-mono text-surface-700">{task.assignedRobot}</span>
                      ) : (
                        <span className="text-surface-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-surface-600 font-mono">{task.createdAt}</td>
                    <td className="py-3 px-4 text-surface-600">{task.estimatedTime}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded hover:bg-surface-100 text-surface-400 hover:text-surface-600" aria-label="View task">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                        {task.status !== 'completed' && task.status !== 'failed' && (
                          <button className="p-1.5 rounded hover:bg-surface-100 text-surface-400 hover:text-surface-600" aria-label="Edit task">
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {task.status === 'pending' && (
                          <button className="p-1.5 rounded hover:bg-red-50 text-red-400 hover:text-red-600" aria-label="Cancel task">
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12 text-surface-500">
            <ClipboardList className="w-12 h-12 mx-auto mb-4 text-surface-300" />
            <p>No tasks match your filters</p>
          </div>
        )}
      </Card>

      {showCreateModal && (
        <CreateTaskModal onClose={() => setShowCreateModal(false)} onCreate={() => setShowCreateModal(false)} />
      )}
    </div>
  )
}

function CreateTaskModal({ onClose, onCreate }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full animate-slide-in">
        <div className="p-6 border-b border-surface-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-surface-900">Create New Task</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-surface-100 text-surface-400 hover:text-surface-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="label">Task Type</label>
            <select className="select">
              <option>Pickup</option>
              <option>Delivery</option>
              <option>Restock</option>
              <option>Charge</option>
            </select>
          </div>
          <div>
            <label className="label">Priority</label>
            <select className="select">
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
          <div>
            <label className="label">From Location</label>
            <select className="select">
              <option>Storage A1</option>
              <option>Storage B2</option>
              <option>Storage A3</option>
              <option>Packing Station 1</option>
              <option>Packing Station 2</option>
              <option>Entry Gate A</option>
              <option>Entry Gate B</option>
              <option>robot_1</option>
              <option>robot_2</option>
              <option>robot_3</option>
              <option>robot_4</option>
              <option>robot_5</option>
            </select>
          </div>
          <div>
            <label className="label">To Location</label>
            <select className="select">
              <option>Packing Station 1</option>
              <option>Packing Station 2</option>
              <option>Exit Gate A</option>
              <option>Exit Gate B</option>
              <option>Shelf C3</option>
              <option>Shelf D1</option>
              <option>Charging Station 1</option>
              <option>Charging Station 2</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button onClick={onCreate} className="btn-primary flex-1">Create Task</button>
          </div>
        </div>
      </div>
    </div>
  )
}