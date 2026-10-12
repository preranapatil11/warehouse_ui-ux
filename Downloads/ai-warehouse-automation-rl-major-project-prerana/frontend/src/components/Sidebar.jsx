import { useLocation } from 'react-router-dom'
import { NAV_ITEMS } from '../App'
import {
  LayoutDashboard,
  Grid,
  Bot,
  ClipboardList,
  Brain,
  BarChart,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const ICON_MAP = {
  LayoutDashboard,
  Grid,
  Bot,
  ClipboardList,
  Brain,
  BarChart,
  History,
  Settings,
}

export function Sidebar({ open, onClose, mobileOpen }) {
  const location = useLocation()

  if (!open && !mobileOpen) {
    return (
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg border border-surface-200 hover:bg-surface-50 transition-colors lg:hidden"
        onClick={onClose}
        aria-label="Open sidebar"
      >
        <ChevronRight className="w-5 h-5 text-surface-600" />
      </button>
    )
  }

  const sidebarWidth = open ? 'w-72' : 'w-20'

  return (
    <aside
      className={`fixed lg:relative z-50 h-full bg-sidebar-bg border-r border-sidebar-border transition-all duration-300 flex flex-col ${sidebarWidth} ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      aria-label="Main navigation"
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          {open && (
            <div className="flex items-center gap-3 animate-slide-in">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <Grid className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-white text-lg">Warehouse AI</h1>
                <p className="text-xs text-surface-400">Navigation Simulator</p>
              </div>
            </div>
          )}
          {!open && !mobileOpen && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-sidebar-hover transition-colors text-surface-400 hover:text-white"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1" role="navigation" aria-label="Sidebar navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.icon]
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
            return (
              <a
                key={item.path}
                href={item.path}
                className={`${isActive ? 'sidebar-link-active' : 'sidebar-link'} group`}
                aria-current={isActive ? 'page' : undefined}
                onClick={onClose}
              >
                <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                {open && <span className="truncate">{item.label}</span>}
              </a>
            )
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          {open && (
            <div className="animate-fade-in space-y-3">
              <div className="px-3 py-2 bg-sidebar-hover rounded-lg">
                <p className="text-xs font-medium text-surface-500 uppercase tracking-wider mb-2">Status</p>
                <div className="flex items-center gap-2 text-sm text-surface-300">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" aria-hidden="true"></span>
                  <span>Backend Connected</span>
                </div>
              </div>
              <div className="px-3 py-2 bg-sidebar-hover rounded-lg">
                <p className="text-xs font-medium text-surface-500 uppercase tracking-wider mb-2">Version</p>
                <p className="text-sm text-surface-400 font-mono">v1.0.0</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}