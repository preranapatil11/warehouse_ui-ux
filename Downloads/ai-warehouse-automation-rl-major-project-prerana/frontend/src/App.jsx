import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Overview } from './pages/Overview'
import { WarehouseSimulator } from './pages/WarehouseSimulator'
import { RobotFleet } from './pages/RobotFleet'
import { TaskManagement } from './pages/TaskManagement'
import { AlgorithmComparison } from './pages/AlgorithmComparison'
import { Analytics } from './pages/Analytics'
import { ExperimentHistory } from './pages/ExperimentHistory'
import { Settings } from './pages/Settings'
import { Sidebar } from './components/Sidebar'
import { TopBar } from './components/TopBar'
import { useApi } from './hooks/useApi.js'

export const NAV_ITEMS = [
  { path: '/', label: 'Overview', icon: 'LayoutDashboard' },
  { path: '/simulator', label: 'Warehouse Simulator', icon: 'Grid' },
  { path: '/robots', label: 'Robot Fleet', icon: 'Bot' },
  { path: '/tasks', label: 'Task Management', icon: 'ClipboardList' },
  { path: '/algorithms', label: 'Algorithm Comparison', icon: 'Brain' },
  { path: '/analytics', label: 'Analytics', icon: 'BarChart' },
  { path: '/history', label: 'Experiment History', icon: 'History' },
  { path: '/settings', label: 'Settings', icon: 'Settings' },
]

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: health, loading: healthLoading } = useApi('/health')

  return (
    <div className="min-h-screen bg-surface-50 flex">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setMobileMenuOpen(false)}
        mobileOpen={mobileMenuOpen}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          onMenuClick={() => setMobileMenuOpen(true)}
          sidebarOpen={sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          backendStatus={health?.status === 'ok' ? 'connected' : 'disconnected'}
          controllers={health?.controllers || []}
          loading={healthLoading}
        />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/simulator" element={<WarehouseSimulator />} />
            <Route path="/robots" element={<RobotFleet />} />
            <Route path="/tasks" element={<TaskManagement />} />
            <Route path="/algorithms" element={<AlgorithmComparison />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/history" element={<ExperimentHistory />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

export default function App() {
  return <AppContent />
}
