# Warehouse AI — Intelligent Robot Navigation Simulator

A complete, modern web application for AI-based warehouse robot navigation using Reinforcement Learning. Built with React, Vite, Tailwind CSS, FastAPI, Gymnasium, Stable-Baselines3, and PyTorch.

## Features

- **Interactive Warehouse Simulator**: 2D grid with shelves, obstacles, robots, packages, charging stations, and more
- **Multiple Algorithms**: PPO, DQN, Q-Learning, A*, BFS, and Random baseline
- **Real-time Robot Monitoring**: Track battery, position, tasks, and status for each robot
- **Multi-Robot Coordination**: Task allocation, collision avoidance, and conflict resolution
- **Battery Management**: Consumption tracking, low-battery warnings, and charging station navigation
- **Analytics Dashboard**: Performance charts, algorithm comparison, and experiment history
- **Professional UI**: Dark sidebar, responsive design, smooth animations

## Project Structure

```
ai-warehouse-automation-rl-major-project-prerana/
├── frontend/                    # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Dashboard pages
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # API services
│   │   ├── context/            # React context providers
│   │   ├── utils/              # Utility functions
│   │   ├── App.jsx             # Main app component
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── backend/                     # FastAPI backend
│   ├── api/
│   │   └── routes.py           # API endpoints
│   ├── services/
│   │   └── simulation_service.py
│   └── main.py                 # FastAPI app
│
├── analytics/                   # Analytics & evaluation
│   ├── metrics.py
│   ├── runner.py
│   └── reports.py
│
├── simulation/                  # Warehouse simulation
├── environment/                 # Gymnasium environment
├── rl_agent/                    # RL training (PPO, DQN)
├── baselines/                   # Classical algorithms (A*, BFS)
├── configs/                     # Scenario configurations
├── data/                        # Recorded episodes & results
└── tests/                       # Unit tests
```

## Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+
- **Git**

## Quick Start

### 1. Backend Setup

```bash
# Navigate to the project root
cd ai-warehouse-automation-rl-major-project-prerana/ai-warehouse-automation-rl-major-project-prerana

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI backend
uvicorn backend.main:app --reload --port 8000
```

The backend will be available at `http://localhost:8000`
API documentation at `http://localhost:8000/docs`

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 3. Verify Integration

1. Open `http://localhost:5173` in your browser
2. The dashboard should show "Backend Connected" in the top bar
3. Navigate to **Warehouse Simulator** and click "Run Simulation"
4. You should see the robot moving on the grid

## Available Scripts

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### Backend
```bash
uvicorn backend.main:app --reload    # Development server
uvicorn backend.main:app --host 0.0.0.0 --port 8000  # Production
python -m pytest tests/              # Run tests
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check backend status |
| GET | `/api/scenarios` | List available scenarios |
| GET | `/api/scenarios/{name}/layout` | Get warehouse layout |
| POST | `/api/run` | Run simulation episode |
| GET | `/api/episodes` | List recorded episodes |
| GET | `/api/episodes/{id}` | Get episode replay |
| GET | `/api/results` | List evaluation results |

## Scenarios

| Scenario | Description |
|----------|-------------|
| `default` | Standard warehouse layout |
| `simple_static` | Simple static obstacles |
| `complex_static` | Complex static obstacles |
| `dynamic_obstacles` | Moving obstacles |
| `battery_constrained` | Limited battery capacity |

## Algorithms

| Algorithm | Type | Status |
|-----------|------|--------|
| A* | Classical Planning | ✅ Available |
| BFS | Classical Planning | ✅ Available |
| Random | Baseline | ✅ Available |
| PPO | Reinforcement Learning | ⚠️ Needs trained model |
| DQN | Reinforcement Learning | ⚠️ Needs trained model |
| Q-Learning | Reinforcement Learning | ⚠️ Needs trained model |

> **Note**: RL algorithms (PPO, DQN, Q-Learning) require trained models. Run `python -m rl_agent.train` to train models first.

## Training RL Models

```bash
# Train PPO on default scenario
python -m rl_agent.train --scenario default --algorithm ppo --timesteps 1000000

# Train on battery-constrained scenario
python -m rl_agent.train --scenario battery_constrained --algorithm ppo --timesteps 2000000

# View training curves
tensorboard --logdir data/logs
```

## Running Evaluations

```bash
# Run full evaluation suite
python scripts/run_experiments.py

# Run specific scenario
python -m analytics.runner --scenario default --controllers astar bfs ppo --episodes 100
```

## Dashboard Pages

1. **Overview** - Summary cards, delivery performance, energy trends
2. **Warehouse Simulator** - Interactive grid, edit mode, simulation controls
3. **Robot Fleet** - Robot monitoring, battery status, task tracking
4. **Task Management** - Create, assign, and track delivery tasks
5. **Algorithm Comparison** - Side-by-side algorithm performance
6. **Analytics** - Deep-dive metrics, collision analysis, insights
7. **Experiment History** - Browse and export recorded simulations
8. **Settings** - Configure backend, simulation, display, notifications

## Development

### Adding a New Page

1. Create component in `src/pages/`
2. Add route in `src/App.jsx`
3. Add navigation item in `src/App.jsx` NAV_ITEMS array

### Adding a New Algorithm

1. Implement in `baselines/controller.py` or `rl_agent/`
2. Register in `backend/services/simulation_service.py`
3. Add to algorithm list in frontend components

## Demo Mode

If the backend is unavailable, the frontend runs in demo mode with sample data:
- Pre-loaded warehouse layouts
- Mock robot fleet data
- Sample analytics charts
- Simulated experiment history

## Troubleshooting

### Backend won't start
- Ensure Python 3.10+ is installed
- Check virtual environment is activated
- Verify all dependencies installed: `pip install -r requirements.txt`
- Check port 8000 is not in use

### Frontend can't connect to backend
- Verify backend is running on port 8000
- Check CORS settings in `backend/main.py`
- Ensure Vite proxy is configured in `vite.config.js`

### RL algorithms unavailable
- Train models first: `python -m rl_agent.train`
- Check models exist in `rl_agent/models/`
- Verify model names match `PPO_MODEL_TAGS` in `simulation_service.py`

## License

MIT License - See LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## Support

For issues and questions, please open a GitHub issue.