import { Play, Pause, RotateCcw, SkipForward, FastForward } from 'lucide-react'

export function SimulationControls({
  running,
  paused,
  currentFrame,
  totalFrames,
  loading,
  onPlayPause,
  onStep,
  onReset,
  onRun,
}) {
  const canStep = currentFrame < totalFrames - 1 && totalFrames > 0
  const hasFrames = totalFrames > 0

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-surface-900">Simulation Controls</h3>
      </div>
      <div className="card-body space-y-4">
        <div className="flex items-center gap-2">
          {running && !paused ? (
            <button
              onClick={onPlayPause}
              disabled={loading}
              className="btn-secondary flex-1"
            >
              <Pause className="w-4 h-4" />
              Pause
            </button>
          ) : running && paused ? (
            <button
              onClick={onPlayPause}
              disabled={loading}
              className="btn-primary flex-1"
            >
              <Play className="w-4 h-4" />
              Resume
            </button>
          ) : hasFrames ? (
            <button
              onClick={onPlayPause}
              disabled={loading}
              className="btn-primary flex-1"
            >
              <Play className="w-4 h-4" />
              Replay
            </button>
          ) : (
            <button
              onClick={onRun}
              disabled={loading}
              className="btn-primary flex-1"
            >
              <FastForward className="w-4 h-4" />
              Run Simulation
            </button>
          )}

          <button
            onClick={onStep}
            disabled={loading || !canStep}
            className="btn-secondary"
            aria-label="Step forward"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={onReset}
            disabled={loading}
            className="btn-ghost"
            aria-label="Reset simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {hasFrames && (
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-surface-600">Frame {currentFrame + 1} of {totalFrames}</span>
              <span className="text-surface-500 font-mono">
                {(currentFrame / Math.max(totalFrames - 1, 1) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="h-2 bg-surface-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-600 rounded-full transition-all duration-300"
                style={{
                  width: `${(currentFrame / Math.max(totalFrames - 1, 1)) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {!hasFrames && !running && (
          <p className="text-center text-sm text-surface-500 py-4">
            Select a scenario and click "Run Simulation" to start
          </p>
        )}

        {running && (
          <div className="flex items-center gap-2 text-sm text-primary-600">
            <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            <span>{paused ? 'Paused' : 'Running...'}</span>
          </div>
        )}
      </div>
    </div>
  )
}