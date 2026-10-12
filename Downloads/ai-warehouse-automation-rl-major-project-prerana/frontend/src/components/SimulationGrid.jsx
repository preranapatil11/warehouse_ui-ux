const CELL_COLORS = {
  0: '#f8fafc',
  1: '#1e293b',
  2: '#78350f',
  3: '#1e40af',
  4: '#166534',
  5: '#854d0e',
  6: '#581c87',
  7: '#9d174d',
}

const CELL_LABELS = {
  0: 'Empty',
  1: 'Wall',
  2: 'Shelf',
  3: 'Storage',
  4: 'Packing',
  5: 'Charging',
  6: 'Entry',
  7: 'Exit',
}

const ROBOT_COLORS = [
  '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'
]

export function SimulationGrid({
  layout,
  currentFrame,
  editMode,
  selectedCell,
  selectedRobot,
  showGridLines,
  onCellClick,
  loading,
}) {
  if (!layout) {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface-100 rounded-xl border-2 border-dashed border-surface-300">
        <div className="text-center text-surface-500">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Loading warehouse layout...</p>
        </div>
      </div>
    )
  }

  const { width, height, grid } = layout
  const robots = currentFrame?.robots || layout.robots
  const packages = currentFrame?.packages || layout.packages

  const getCellContent = (x, y) => {
    const cellType = grid[y]?.[x] || 0
    const robot = robots.find((r) => r.x === x && r.y === y)
    const pkg = packages.find((p) => p.x === x && p.y === y && !p.delivered)

    if (robot) return { type: 'robot', data: robot }
    if (pkg) return { type: 'package', data: pkg }
    return { type: 'cell', cellType }
  }

  const cellSize = Math.min(
    Math.floor((window.innerWidth - 300) / width),
    Math.floor((window.innerHeight - 200) / height)
  )

  return (
    <div
      className="flex-1 flex items-center justify-center overflow-auto p-4"
      role="grid"
      aria-label="Warehouse grid"
    >
      <div
        className="relative"
        style={{
          width: width * Math.max(cellSize, 24),
          height: height * Math.max(cellSize, 24),
        }}
      >
        <div
          className="absolute inset-0 bg-surface-100"
          style={{
            backgroundImage: showGridLines
              ? `linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)`
              : 'none',
            backgroundSize: `${Math.max(cellSize, 24)}px ${Math.max(cellSize, 24)}px`,
          }}
        />

        {grid.map((row, y) =>
          row.map((cellType, x) => {
            const content = getCellContent(x, y)
            const isSelected = selectedCell?.x === x && selectedCell?.y === y
            const isRobotSelected = content.type === 'robot' && selectedRobot === content.data.id

            let bgColor = CELL_COLORS[cellType] || '#f8fafc'
            let borderColor = '#e2e8f0'
            let label = ''
            let showBattery = false
            let batteryLevel = 100

            if (content.type === 'robot') {
              const robotIndex = layout.robots.findIndex(r => r.id === content.data.id)
              bgColor = ROBOT_COLORS[robotIndex % ROBOT_COLORS.length]
              borderColor = isRobotSelected ? '#fff' : ROBOT_COLORS[robotIndex % ROBOT_COLORS.length]
              label = content.data.id.replace('robot_', 'R')
              showBattery = true
              batteryLevel = content.data.battery
            } else if (content.type === 'package') {
              bgColor = '#f59e0b'
              borderColor = '#d97706'
              label = '📦'
            } else if (cellType > 0) {
              label = CELL_LABELS[cellType]?.charAt(0) || ''
            }

            return (
              <button
                key={`${x}-${y}`}
                onClick={() => onCellClick(x, y)}
                disabled={loading}
                className="absolute transition-all duration-200"
                style={{
                  left: x * Math.max(cellSize, 24),
                  top: y * Math.max(cellSize, 24),
                  width: Math.max(cellSize, 24) - (showGridLines ? 1 : 0),
                  height: Math.max(cellSize, 24) - (showGridLines ? 1 : 0),
                  backgroundColor: bgColor,
                  borderColor: isSelected || isRobotSelected ? '#3b82f6' : borderColor,
                  borderWidth: isSelected || isRobotSelected ? 3 : 1,
                  borderRadius: '4px',
                  zIndex: content.type === 'robot' ? 10 : content.type === 'package' ? 5 : 1,
                }}
                aria-label={`${content.type === 'robot' ? 'Robot' : content.type === 'package' ? 'Package' : 'Cell'} at ${x}, ${y}`}
              >
                <div className="flex flex-col items-center justify-center h-full p-1">
                  {content.type === 'robot' && (
                    <>
                      <span className="text-white text-xs font-bold drop-shadow">{label}</span>
                      {showBattery && (
                        <div className="w-full h-1.5 bg-white/20 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${batteryLevel}%`,
                              backgroundColor: batteryLevel > 30 ? '#22c55e' : batteryLevel > 15 ? '#f59e0b' : '#ef4444',
                            }}
                          />
                        </div>
                      )}
                    </>
                  )}
                  {content.type === 'package' && <span className="text-white text-lg">{label}</span>}
                  {content.type === 'cell' && cellType > 0 && (
                    <span className="text-white/80 text-[8px] font-medium text-center">{label}</span>
                  )}
                </div>
              </button>
            )
          })
        )}

        {selectedCell && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: selectedCell.x * Math.max(cellSize, 24),
              top: selectedCell.y * Math.max(cellSize, 24),
              width: Math.max(cellSize, 24),
              height: Math.max(cellSize, 24),
            }}
          >
            <div className="absolute inset-0 border-2 border-primary-500 rounded-[4px] animate-pulse" />
          </div>
        )}
      </div>
    </div>
  )
}