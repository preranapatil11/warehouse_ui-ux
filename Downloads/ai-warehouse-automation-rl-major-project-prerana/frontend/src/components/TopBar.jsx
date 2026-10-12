import {
  Menu,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Download,
  Upload,
} from 'lucide-react'

export function TopBar({
  onMenuClick,
  sidebarOpen,
  onSidebarToggle,
  backendStatus,
  controllers = [],
  loading,
}) {
  const availableControllers = controllers
    .filter((controller) => controller.available)
    .map((controller) => controller.name?.toLowerCase())

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-surface-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 md:px-6 gap-4">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-surface-100 text-surface-600 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={onSidebarToggle}
            className="hidden lg:flex p-2 rounded-lg hover:bg-surface-100 text-surface-600 transition-colors"
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>

          {/* Backend connection status */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-50 border border-surface-200">
            {loading ? (
              <>
                <span className="w-4 h-4 rounded-full bg-surface-200 animate-pulse" />
                <span className="text-sm font-medium text-surface-500">
                  Checking...
                </span>
              </>
            ) : (
              <>
                <span
                  className={`w-2 h-2 rounded-full ${
                    backendStatus === 'connected'
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  }`}
                />
                <span className="text-sm font-medium text-surface-700">
                  {backendStatus === 'connected'
                    ? 'Connected'
                    : 'Disconnected'}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Warehouse scenario selector */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <select
              className="select w-full py-2 pl-4 pr-10 text-sm bg-white"
              defaultValue="default"
              aria-label="Select scenario"
            >
              <option value="default">Default Warehouse</option>
              <option value="simple_static">Simple Static</option>
              <option value="complex_static">Complex Static</option>
              <option value="dynamic_obstacles">Dynamic Obstacles</option>
              <option value="battery_constrained">Battery Constrained</option>
            </select>

            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Algorithm selector */}
          <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-50 border border-surface-200">
            <Cpu className="w-4 h-4 text-surface-500" />

            <select
              className="select bg-transparent py-1.5 text-sm"
              defaultValue="astar"
              aria-label="Select algorithm"
            >
              <option value="astar">A*</option>
              <option value="bfs">BFS</option>
              <option value="random">Random</option>
              <option
                value="ppo"
                disabled={!availableControllers.includes('ppo')}
              >
                PPO{' '}
                {availableControllers.includes('ppo')
                  ? ''
                  : '(unavailable)'}
              </option>
            </select>
          </div>

          {/* Notifications */}
          <button
            type="button"
            className="p-2 rounded-lg hover:bg-surface-100 text-surface-600 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Data actions */}
          <div className="hidden md:flex items-center gap-1 pl-3 border-l border-surface-200">
            <button
              type="button"
              className="p-2 rounded-lg hover:bg-surface-100 text-surface-600 transition-colors"
              aria-label="Export data"
            >
              <Download className="w-5 h-5" />
            </button>

            <button
              type="button"
              className="p-2 rounded-lg hover:bg-surface-100 text-surface-600 transition-colors"
              aria-label="Import data"
            >
              <Upload className="w-5 h-5" />
            </button>
          </div>

          {/* User profile */}
          <div className="flex items-center gap-3 pl-3 border-l border-surface-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-medium text-sm">
              WA
            </div>

            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-surface-900">
                Warehouse Admin
              </p>
              <p className="text-xs text-surface-500">Operator</p>
            </div>

            <ChevronDown className="hidden md:block w-4 h-4 text-surface-400" />
          </div>
        </div>
      </div>
    </header>
  )
}