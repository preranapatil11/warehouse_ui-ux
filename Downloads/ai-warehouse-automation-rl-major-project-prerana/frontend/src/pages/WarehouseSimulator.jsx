import { useState, useCallback, useEffect, useRef } from 'react'
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Plus,
  Minus,
  Trash2,
  Download,
  Upload,
  Grid,
  Bot,
  Package,
  Home,
  Zap,
  Warehouse,
  ArrowRight,
  Layers,
  Eraser,
  Save,
  Eye,
  EyeOff,
  AlertTriangle,
} from 'lucide-react'
import { useScenarios } from '../hooks/useApi.js'
import { apiService } from '../services/api.js'
import { Card } from '../components/Card'
import { SimulationGrid } from '../components/SimulationGrid'
import { SimulationControls } from '../components/SimulationControls'
import { RobotPanel } from '../components/RobotPanel'

const CELL_TYPES = {
  0: { label: 'Empty', color: '#f8fafc', icon: Grid },
  1: { label: 'Wall/Obstacle', color: '#1e293b', icon: Trash2 },
  2: { label: 'Shelf', color: '#78350f', icon: Warehouse },
  3: { label: 'Storage', color: '#1e40af', icon: Home },
  4: { label: 'Packing', color: '#166534', icon: Package },
  5: { label: 'Charging', color: '#854d0e', icon: Zap },
  6: { label: 'Entry', color: '#581c87', icon: ArrowRight },
  7: { label: 'Exit', color: '#9d174d', icon: ArrowRight },
}

const ROBOT_COLORS = [
  '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'
]

export function WarehouseSimulator() {
  const { data: scenarios, loading: scenariosLoading } = useScenarios()
  const [layout, setLayout] = useState(null)
  const [scenario, setScenario] = useState('default')
  const [controller, setController] = useState('astar')
  const [seed, setSeed] = useState(0)
  const [editMode, setEditMode] = useState('select')
  const [selectedCell, setSelectedCell] = useState(null)
  const [simulationRunning, setSimulationRunning] = useState(false)
  const [simulationPaused, setSimulationPaused] = useState(false)
  const [currentFrame, setCurrentFrame] = useState(0)
  const [frames, setFrames] = useState([])
  const [summary, setSummary] = useState(null)
  const [selectedRobot, setSelectedRobot] = useState(null)
  const [showGridLines, setShowGridLines] = useState(true)
  const [animationSpeed, setAnimationSpeed] = useState(1)
  const animationRef = useRef()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadLayout = useCallback(async (scenarioName) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiService.getLayout(scenarioName)
      setLayout(data)
      setScenario(scenarioName)
      setFrames([])
      setCurrentFrame(0)
      setSummary(null)
      setSelectedRobot(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load layout')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadLayout('default')
  }, [loadLayout])

  const runSimulation = async () => {
    if (!layout) return

    setLoading(true)
    setError(null)
    try {
      const request = {
        scenario,
        controller,
        seed,
        layout: layout.grid,
      }
      const result = await apiService.runEpisode(request)
      setFrames(result.frames)
      setSummary(result.summary)
      setCurrentFrame(0)
      setSimulationRunning(true)
      setSimulationPaused(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Simulation failed')
    } finally {
      setLoading(false)
    }
  }

  const stepSimulation = () => {
    if (currentFrame < frames.length - 1) {
      setCurrentFrame(prev => prev + 1)
    }
  }

  const resetSimulation = () => {
    setSimulationRunning(false)
    setSimulationPaused(false)
    setCurrentFrame(0)
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }

  const togglePlayPause = () => {
    if (simulationRunning && !simulationPaused) {
      setSimulationPaused(true)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    } else if (simulationRunning && simulationPaused) {
      setSimulationPaused(false)
      animate()
    } else if (!simulationRunning && frames.length > 0) {
      setSimulationRunning(true)
      setSimulationPaused(false)
      animate()
    } else {
      runSimulation()
    }
  }

  const animate = () => {
    if (simulationPaused || !simulationRunning) return

    if (currentFrame < frames.length - 1) {
      setCurrentFrame(prev => prev + 1)
      animationRef.current = requestAnimationFrame(() => {
        setTimeout(animate, 1000 / animationSpeed)
      })
    } else {
      setSimulationRunning(false)
    }
  }

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  const handleCellClick = (x, y) => {
    if (!layout) return

    setSelectedCell({ x, y })

    if (editMode === 'select') {
      const robot = layout.robots.find(r => r.x === x && r.y === y)
      if (robot) {
        setSelectedRobot(robot.id)
      } else {
        setSelectedRobot(null)
      }
    } else if (editMode === 'erase') {
      updateCell(x, y, 0)
    } else {
      const cellType = getCellTypeFromEditMode(editMode)
      updateCell(x, y, cellType)
    }
  }

  const getCellTypeFromEditMode = (mode) => {
    switch (mode) {
      case 'wall': return 1
      case 'shelf': return 2
      case 'storage': return 3
      case 'packing': return 4
      case 'charging': return 5
      case 'entry': return 6
      case 'exit': return 7
      case 'robot': return 8
      case 'package': return 9
      default: return 0
    }
  }

  const updateCell = (x, y, type) => {
    if (!layout) return

    const newGrid = layout.grid.map((row, rowIdx) =>
      row.map((cell, colIdx) => (colIdx === x && rowIdx === y ? type : cell))
    )

    const newLayout = { ...layout, grid: newGrid }
    setLayout(newLayout)
  }

  const currentFrameData = frames[currentFrame]

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-surface-900">Warehouse Simulator</h2>
              <p className="text-surface-500 text-sm">Interactive 2D warehouse grid with real-time simulation</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={scenario}
                onChange={(e) => loadLayout(e.target.value)}
                disabled={loading || simulationRunning}
                className="select py-2 px-3 text-sm"
              >
                {scenarios?.map(s => (
                  <option key={s.name} value={s.name}>{s.title}</option>
                ))}
              </select>
              {layout && (
                <button
                  onClick={() => downloadLayout()}
                  className="btn-secondary"
                  disabled={simulationRunning}
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="flex-1 flex flex-col overflow-hidden">
            <SimulationGrid
              layout={layout}
              currentFrame={currentFrameData}
              editMode={editMode}
              selectedCell={selectedCell}
              selectedRobot={selectedRobot}
              showGridLines={showGridLines}
              onCellClick={handleCellClick}
              loading={loading}
            />

            <div className="mt-4 flex flex-wrap items-center gap-4 p-4 bg-surface-50 rounded-xl border border-surface-200">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-surface-700">Edit Mode:</span>
                {Object.entries(CELL_TYPES).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => setEditMode(key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      editMode === key
                        ? 'bg-primary-600 text-white shadow-sm'
                        : 'bg-white text-surface-600 hover:bg-surface-100 border border-surface-200'
                    }`}
                  >
                    {value.label}
                  </button>
                ))}
                <button
                  onClick={() => setEditMode('erase')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    editMode === 'erase'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-white text-surface-600 hover:bg-surface-100 border border-surface-200'
                  }`}
                >
                  <Eraser className="w-3 h-3 inline mr-1" /> Erase
                </button>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <label className="flex items-center gap-2 text-sm text-surface-600">
                  <input
                    type="checkbox"
                    checked={showGridLines}
                    onChange={(e) => setShowGridLines(e.target.checked)}
                    className="rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                  />
                  Grid Lines
                </label>
                <label className="flex items-center gap-2 text-sm text-surface-600">
                  Speed:
                  <select
                    value={animationSpeed}
                    onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                    className="select py-1 px-2 text-sm w-auto"
                  >
                    <option value={0.5}>0.5x</option>
                    <option value={1}>1x</option>
                    <option value={2}>2x</option>
                    <option value={5}>5x</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-80 flex flex-col gap-4">
          <SimulationControls
            running={simulationRunning}
            paused={simulationPaused}
            currentFrame={currentFrame}
            totalFrames={frames.length}
            loading={loading}
            onPlayPause={togglePlayPause}
            onStep={stepSimulation}
            onReset={resetSimulation}
            onRun={runSimulation}
          />

          <RobotPanel
            layout={layout}
            currentFrame={currentFrameData}
            selectedRobot={selectedRobot}
            onSelectRobot={setSelectedRobot}
            summary={summary}
          />

          <Card title="Legend" className="flex-1">
            <div className="space-y-2">
              {Object.entries(CELL_TYPES).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2 text-sm">
                  <div
                    className="w-4 h-4 rounded border flex-shrink-0"
                    style={{ backgroundColor: value.color }}
                  />
                  <span className="text-surface-700">{value.label}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 text-sm">
                <div className="w-4 h-4 rounded border flex-shrink-0" style={{ backgroundColor: '#3b82f6' }} />
                <span className="text-surface-700">Robot</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-4 h-4 rounded border flex-shrink-0" style={{ backgroundColor: '#f59e0b' }} />
                <span className="text-surface-700">Package</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function downloadLayout() {
  // Implementation for downloading layout
}