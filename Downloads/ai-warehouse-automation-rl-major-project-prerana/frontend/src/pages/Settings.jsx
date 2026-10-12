import { useState } from 'react'
import {
  Settings as SettingsIcon,
  Server,
  Database,
  Cpu,
  Bell,
  Shield,
  User,
  Palette,
  Globe,
  Download,
  Upload,
  Trash2,
  Key,
  Moon,
  Monitor,
  Save,
  Loader2,
} from 'lucide-react'
import { Card } from '../components/Card'

export function Settings() {
  const [activeTab, setActiveTab] = useState('general')
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    general: {
      warehouseName: 'Main Warehouse',
      timezone: 'UTC',
      language: 'en',
      dateFormat: 'YYYY-MM-DD',
      autoRefresh: true,
      refreshInterval: 30,
    },
    backend: {
      apiUrl: 'http://localhost:8000',
      websocketUrl: 'ws://localhost:8000/ws',
      requestTimeout: 30000,
      maxRetries: 3,
      enableCors: true,
    },
    simulation: {
      defaultScenario: 'default',
      defaultAlgorithm: 'astar',
      maxSteps: 2000,
      animationSpeed: 1,
      showGridLines: true,
      showBatteryIndicators: true,
      showPathPreview: true,
      collisionDetection: true,
      multiRobotCoordination: true,
    },
    display: {
      theme: 'light',
      compactMode: false,
      showAnimations: true,
      reducedMotion: false,
      sidebarCollapsed: false,
      chartColors: 'default',
    },
    notifications: {
      emailEnabled: false,
      pushEnabled: true,
      simulationComplete: true,
      simulationFailed: true,
      lowBatteryWarning: true,
      collisionAlert: true,
      taskAssigned: false,
      dailySummary: false,
    },
    security: {
      apiKey: '',
      requireAuth: false,
      sessionTimeout: 3600,
      allowedOrigins: 'http://localhost:5173,http://127.0.0.1:5173',
      rateLimit: 100,
    },
    data: {
      autoSave: true,
      saveInterval: 60,
      maxEpisodesStored: 1000,
      maxResultsStored: 500,
      exportFormat: 'json',
      dataRetentionDays: 90,
    },
  })

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'backend', label: 'Backend', icon: Server },
    { id: 'simulation', label: 'Simulation', icon: Cpu },
    { id: 'display', label: 'Display', icon: Monitor },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'data', label: 'Data Management', icon: Database },
  ]

  const handleSave = async (section) => {
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    // In a real app, this would save to localStorage or send to backend
    console.log(`Saved ${section} settings:`, settings[section])
  }

  const handleReset = (section) => {
    // Reset to defaults
    console.log(`Reset ${section} settings`)
  }

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `warehouse-ai-settings-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target?.result)
          setSettings(prev => ({ ...prev, ...imported }))
        } catch (err) {
          console.error('Failed to import settings:', err)
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Settings</h1>
          <p className="text-surface-500 mt-1">Configure Warehouse AI simulator preferences</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary" onClick={handleExport}>
            <Download className="w-4 h-4" />
            Export Settings
          </button>
          <label className="btn-secondary cursor-pointer">
            <Upload className="w-4 h-4" />
            Import Settings
            <input type="file" accept=".json" className="hidden" onChange={handleImport} />
          </label>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-48 flex-shrink-0">
          <nav className="card space-y-1 p-2" aria-label="Settings navigation">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary-600 text-white'
                      : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {tab.label}
                </button>
              )
            })}
          </nav>

          <div className="mt-4 card p-4">
            <h3 className="font-medium text-surface-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full btn-secondary justify-start" onClick={() => handleExport()}>
                <Download className="w-4 h-4" />
                Export All Settings
              </button>
              <button className="w-full btn-secondary justify-start">
                <Trash2 className="w-4 h-4" />
                Clear Cache
              </button>
              <button className="w-full btn-ghost justify-start text-red-600 hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
                Reset All to Defaults
              </button>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {activeTab === 'general' && (
            <SettingsSection title="General Settings" description="Basic application configuration">
              <SettingsForm
                settings={settings.general}
                onChange={(key, value) => setSettings(prev => ({ ...prev, general: { ...prev.general, [key]: value } }))}
                fields={[
                  { key: 'warehouseName', label: 'Warehouse Name', type: 'text', placeholder: 'Main Warehouse' },
                  { key: 'timezone', label: 'Timezone', type: 'select', options: ['UTC', 'EST', 'PST', 'CET', 'JST', 'AEST'] },
                  { key: 'language', label: 'Language', type: 'select', options: [{ value: 'en', label: 'English' }, { value: 'es', label: 'Spanish' }, { value: 'fr', label: 'French' }, { value: 'de', label: 'German' }, { value: 'zh', label: 'Chinese' }] },
                  { key: 'dateFormat', label: 'Date Format', type: 'select', options: ['YYYY-MM-DD', 'MM/DD/YYYY', 'DD/MM/YYYY', 'DD.MM.YYYY'] },
                  { key: 'autoRefresh', label: 'Auto-refresh Dashboard', type: 'boolean' },
                  { key: 'refreshInterval', label: 'Refresh Interval (seconds)', type: 'number', min: 10, max: 300, step: 10 },
                ]}
              />
              <div className="flex gap-3 pt-4 border-t border-surface-200">
                <button className="btn-primary" onClick={() => handleSave('general')} disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <> <Save className="w-4 h-4" /> Save Changes </>}
                </button>
                <button className="btn-secondary" onClick={() => handleReset('general')}>
                  Reset to Defaults
                </button>
              </div>
            </SettingsSection>
          )}

          {activeTab === 'backend' && (
            <SettingsSection title="Backend Configuration" description="API and connection settings">
              <SettingsForm
                settings={settings.backend}
                onChange={(key, value) => setSettings(prev => ({ ...prev, backend: { ...prev.backend, [key]: value } }))}
                fields={[
                  { key: 'apiUrl', label: 'API Base URL', type: 'text', placeholder: 'http://localhost:8000' },
                  { key: 'websocketUrl', label: 'WebSocket URL', type: 'text', placeholder: 'ws://localhost:8000/ws' },
                  { key: 'requestTimeout', label: 'Request Timeout (ms)', type: 'number', min: 5000, max: 120000, step: 5000 },
                  { key: 'maxRetries', label: 'Max Retries', type: 'number', min: 0, max: 10, step: 1 },
                  { key: 'enableCors', label: 'Enable CORS', type: 'boolean' },
                ]}
              />
              <div className="flex gap-3 pt-4 border-t border-surface-200">
                <button className="btn-primary" onClick={() => handleSave('backend')} disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <> <Save className="w-4 h-4" /> Save Changes </>}
                </button>
                <button className="btn-secondary" onClick={() => handleReset('backend')}>
                  Reset to Defaults
                </button>
              </div>
            </SettingsSection>
          )}

          {activeTab === 'simulation' && (
            <SettingsSection title="Simulation Settings" description="Default parameters for warehouse simulations">
              <SettingsForm
                settings={settings.simulation}
                onChange={(key, value) => setSettings(prev => ({ ...prev, simulation: { ...prev.simulation, [key]: value } }))}
                fields={[
                  { key: 'defaultScenario', label: 'Default Scenario', type: 'select', options: ['default', 'simple_static', 'complex_static', 'dynamic_obstacles', 'battery_constrained'] },
                  { key: 'defaultAlgorithm', label: 'Default Algorithm', type: 'select', options: ['astar', 'bfs', 'dqn', 'ppo', 'qlearning', 'random'] },
                  { key: 'maxSteps', label: 'Max Steps per Episode', type: 'number', min: 100, max: 10000, step: 100 },
                  { key: 'animationSpeed', label: 'Default Animation Speed', type: 'select', options: ['0.5', '1', '2', '5', '10'] },
                  { key: 'showGridLines', label: 'Show Grid Lines', type: 'boolean' },
                  { key: 'showBatteryIndicators', label: 'Show Battery Indicators', type: 'boolean' },
                  { key: 'showPathPreview', label: 'Show Path Preview', type: 'boolean' },
                  { key: 'collisionDetection', label: 'Enable Collision Detection', type: 'boolean' },
                  { key: 'multiRobotCoordination', label: 'Multi-Robot Coordination', type: 'boolean' },
                ]}
              />
              <div className="flex gap-3 pt-4 border-t border-surface-200">
                <button className="btn-primary" onClick={() => handleSave('simulation')} disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <> <Save className="w-4 h-4" /> Save Changes </>}
                </button>
                <button className="btn-secondary" onClick={() => handleReset('simulation')}>
                  Reset to Defaults
                </button>
              </div>
            </SettingsSection>
          )}

          {activeTab === 'display' && (
            <SettingsSection title="Display & Appearance" description="Customize the look and feel of the dashboard">
              <SettingsForm
                settings={settings.display}
                onChange={(key, value) => setSettings(prev => ({ ...prev, display: { ...prev.display, [key]: value } }))}
                fields={[
                  { key: 'theme', label: 'Theme', type: 'select', options: ['light', 'dark', 'system'] },
                  { key: 'compactMode', label: 'Compact Mode', type: 'boolean' },
                  { key: 'showAnimations', label: 'Show Animations', type: 'boolean' },
                  { key: 'reducedMotion', label: 'Reduced Motion', type: 'boolean' },
                  { key: 'sidebarCollapsed', label: 'Start with Sidebar Collapsed', type: 'boolean' },
                  { key: 'chartColors', label: 'Chart Color Scheme', type: 'select', options: ['default', 'colorblind', 'high-contrast', 'monochrome'] },
                ]}
              />
              <div className="flex gap-3 pt-4 border-t border-surface-200">
                <button className="btn-primary" onClick={() => handleSave('display')} disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <> <Save className="w-4 h-4" /> Save Changes </>}
                </button>
                <button className="btn-secondary" onClick={() => handleReset('display')}>
                  Reset to Defaults
                </button>
              </div>
            </SettingsSection>
          )}

          {activeTab === 'notifications' && (
            <SettingsSection title="Notifications" description="Configure when and how you receive alerts">
              <SettingsForm
                settings={settings.notifications}
                onChange={(key, value) => setSettings(prev => ({ ...prev, notifications: { ...prev.notifications, [key]: value } }))}
                fields={[
                  { key: 'emailEnabled', label: 'Enable Email Notifications', type: 'boolean' },
                  { key: 'pushEnabled', label: 'Enable Push Notifications', type: 'boolean' },
                  { key: 'simulationComplete', label: 'Simulation Completed', type: 'boolean' },
                  { key: 'simulationFailed', label: 'Simulation Failed', type: 'boolean' },
                  { key: 'lowBatteryWarning', label: 'Low Battery Warning', type: 'boolean' },
                  { key: 'collisionAlert', label: 'Collision Alert', type: 'boolean' },
                  { key: 'taskAssigned', label: 'Task Assigned', type: 'boolean' },
                  { key: 'dailySummary', label: 'Daily Summary', type: 'boolean' },
                ]}
              />
              <div className="flex gap-3 pt-4 border-t border-surface-200">
                <button className="btn-primary" onClick={() => handleSave('notifications')} disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <> <Save className="w-4 h-4" /> Save Changes </>}
                </button>
                <button className="btn-secondary" onClick={() => handleReset('notifications')}>
                  Reset to Defaults
                </button>
              </div>
            </SettingsSection>
          )}

          {activeTab === 'security' && (
            <SettingsSection title="Security" description="Authentication and access control settings">
              <SettingsForm
                settings={settings.security}
                onChange={(key, value) => setSettings(prev => ({ ...prev, security: { ...prev.security, [key]: value } }))}
                fields={[
                  { key: 'apiKey', label: 'API Key', type: 'password', placeholder: 'Enter API key...' },
                  { key: 'requireAuth', label: 'Require Authentication', type: 'boolean' },
                  { key: 'sessionTimeout', label: 'Session Timeout (seconds)', type: 'number', min: 300, max: 86400, step: 300 },
                  { key: 'allowedOrigins', label: 'Allowed Origins (comma-separated)', type: 'text', placeholder: 'http://localhost:5173,http://127.0.0.1:5173' },
                  { key: 'rateLimit', label: 'Rate Limit (requests/minute)', type: 'number', min: 10, max: 1000, step: 10 },
                ]}
              />
              <div className="flex gap-3 pt-4 border-t border-surface-200">
                <button className="btn-primary" onClick={() => handleSave('security')} disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <> <Save className="w-4 h-4" /> Save Changes </>}
                </button>
                <button className="btn-secondary" onClick={() => handleReset('security')}>
                  Reset to Defaults
                </button>
              </div>
            </SettingsSection>
          )}

          {activeTab === 'data' && (
            <SettingsSection title="Data Management" description="Control how simulation data is stored and retained">
              <SettingsForm
                settings={settings.data}
                onChange={(key, value) => setSettings(prev => ({ ...prev, data: { ...prev.data, [key]: value } }))}
                fields={[
                  { key: 'autoSave', label: 'Auto-save Simulation Data', type: 'boolean' },
                  { key: 'saveInterval', label: 'Auto-save Interval (seconds)', type: 'number', min: 10, max: 3600, step: 10 },
                  { key: 'maxEpisodesStored', label: 'Max Episodes Stored', type: 'number', min: 100, max: 10000, step: 100 },
                  { key: 'maxResultsStored', label: 'Max Evaluation Results Stored', type: 'number', min: 50, max: 5000, step: 50 },
                  { key: 'exportFormat', label: 'Default Export Format', type: 'select', options: ['json', 'csv', 'both'] },
                  { key: 'dataRetentionDays', label: 'Data Retention (days)', type: 'number', min: 7, max: 365, step: 7 },
                ]}
              />
              <div className="flex gap-3 pt-4 border-t border-surface-200">
                <button className="btn-primary" onClick={() => handleSave('data')} disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <> <Save className="w-4 h-4" /> Save Changes </>}
                </button>
                <button className="btn-secondary" onClick={() => handleReset('data')}>
                  Reset to Defaults
                </button>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-surface-50 border border-surface-200">
                <h4 className="font-medium text-surface-900 mb-3">Storage Usage</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="p-3 rounded-lg bg-white">
                    <p className="text-2xl font-bold text-surface-900">247 MB</p>
                    <p className="text-xs text-surface-500">Episodes</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white">
                    <p className="text-2xl font-bold text-surface-900">89 MB</p>
                    <p className="text-xs text-surface-500">Results</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white">
                    <p className="text-2xl font-bold text-surface-900">12 MB</p>
                    <p className="text-xs text-surface-500">Logs</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white">
                    <p className="text-2xl font-bold text-surface-900">348 MB</p>
                    <p className="text-xs text-surface-500">Total</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="btn-secondary">
                    <Trash2 className="w-4 h-4" />
                    Clear Old Data
                  </button>
                  <button className="btn-secondary">
                    <Download className="w-4 h-4" />
                    Backup Data
                  </button>
                </div>
              </div>
            </SettingsSection>
          )}
        </div>
      </div>
    </div>
  )
}

function SettingsSection({ title, description, children }) {
  return (
    <Card>
      <div className="card-header">
        <div>
          <h3 className="text-lg font-semibold text-surface-900">{title}</h3>
          <p className="text-sm text-surface-500 mt-0.5">{description}</p>
        </div>
      </div>
      <div className="card-body">{children}</div>
    </Card>
  )
}

function SettingsForm({ settings, onChange, fields }) {
  return (
    <div className="space-y-4">
      {fields.map(field => {
        const value = settings[field.key]
        const options = field.options || []

        if (field.type === 'boolean') {
          return (
            <div key={field.key} className="flex items-center justify-between py-2">
              <label className="font-medium text-surface-700">{field.label}</label>
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => onChange(field.key, e.target.checked)}
                className="w-11 h-6 rounded-full bg-surface-200 appearance-none relative cursor-pointer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-all after:shadow-sm checked:after:left-[4px] checked:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              />
            </div>
          )
        }

        if (field.type === 'select') {
          return (
            <div key={field.key} className="space-y-1">
              <label className="label">{field.label}</label>
              <select
                value={value}
                onChange={(e) => onChange(field.key, e.target.value)}
                className="select"
              >
                {options.map(opt => (
                  <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
                    {typeof opt === 'string' ? opt : opt.label}
                  </option>
                ))}
              </select>
            </div>
          )
        }

        return (
          <div key={field.key} className="space-y-1">
            <label className="label">{field.label}</label>
            <input
              type={field.type === 'password' ? 'password' : field.type}
              value={value}
              onChange={(e) => onChange(field.key, field.type === 'number' ? Number(e.target.value) : e.target.value)}
              placeholder={field.placeholder}
              min={field.min}
              max={field.max}
              step={field.step}
              className="input"
            />
          </div>
        )
      })}
    </div>
  )
}
