"""Warehouse Gymnasium environment."""

from __future__ import annotations

from typing import Any
import gymnasium as gym
import numpy as np


class WarehouseEnv(gym.Env):
    """Gymnasium environment for warehouse robot navigation."""

    metadata = {"render_modes": ["human", "rgb_array"], "render_fps": 10}

    def __init__(self, config: Any, layout: Any = None):
        super().__init__()
        self.config = config
        self.layout = layout or config.layout
        self.max_steps = config.max_steps

        # Define action and observation spaces
        self.action_space = gym.spaces.Discrete(5)  # up, down, left, right, stay
        self.observation_space = gym.spaces.Box(
            low=0, high=255, shape=(self.layout.height, self.layout.width, 3), dtype=np.uint8
        )

        self.sim = None
        self.steps = 0

    def reset(self, *, seed: int | None = None, options: dict | None = None):
        super().reset(seed=seed)
        self.steps = 0

        # Create a simple simulation object
        class SimpleSim:
            def __init__(self, layout):
                self.layout = layout
                self.robots = [
                    type("Robot", (), {
                        "id": f"robot_{i}",
                        "x": 1,
                        "y": 1 + i,
                        "battery": 100,
                        "carrying": None,
                        "target": None,
                        "status": "idle",
                        "distance_travelled": 0,
                        "deliveries_completed": 0,
                        "algorithm": "astar",
                    })()
                    for i in range(2)
                ]
                self.packages = []
                self.counters = type("Counters", (), {
                    "steps": 0,
                    "moves": 0,
                    "optimal_path_length": 0,
                    "collisions": 0,
                    "static_collisions": 0,
                    "dynamic_collisions": 0,
                    "idle_steps": 0,
                    "energy_consumed": 0.0,
                    "charging_events": 0,
                    "tasks_delivered": 0,
                    "tasks_failed": 0,
                    "termination_reason": "unknown",
                })()

        self.sim = SimpleSim(self.layout)
        return self._get_obs(), {}

    def _get_obs(self) -> np.ndarray:
        """Generate observation as RGB grid."""
        obs = np.zeros((self.layout.height, self.layout.width, 3), dtype=np.uint8)
        # Fill with basic colors based on cell type
        for y in range(self.layout.height):
            for x in range(self.layout.width):
                cell = self.layout.grid[y][x]
                if cell == 1:  # wall
                    obs[y, x] = [50, 50, 50]
                elif cell == 2:  # shelf
                    obs[y, x] = [120, 50, 0]
                elif cell == 3:  # storage
                    obs[y, x] = [0, 0, 200]
                elif cell == 4:  # packing
                    obs[y, x] = [0, 150, 0]
                elif cell == 5:  # charging
                    obs[y, x] = [200, 150, 0]
                elif cell == 6:  # entry
                    obs[y, x] = [150, 0, 150]
                elif cell == 7:  # exit
                    obs[y, x] = [200, 0, 100]
                else:
                    obs[y, x] = [240, 240, 240]

        # Draw robots
        if self.sim and hasattr(self.sim, "robots"):
            for i, robot in enumerate(self.sim.robots):
                if 0 <= robot.y < self.layout.height and 0 <= robot.x < self.layout.width:
                    obs[robot.y, robot.x] = [50, 100, 255]

        return obs

    def step(self, action: int):
        self.steps += 1
        if self.sim and hasattr(self.sim, "counters"):
            self.sim.counters.steps += 1

        # Simple movement logic
        if self.sim and hasattr(self.sim, "robots") and self.sim.robots:
            robot = self.sim.robots[0]
            dx, dy = [(0, 0), (0, -1), (0, 1), (-1, 0), (1, 0)][action]
            new_x, new_y = robot.x + dx, robot.y + dy

            # Check bounds and walls
            if (0 <= new_x < self.layout.width and
                0 <= new_y < self.layout.height and
                self.layout.grid[new_y][new_x] != 1):
                robot.x, robot.y = new_x, new_y
                robot.distance_travelled += 1
                if hasattr(self.sim, "counters"):
                    self.sim.counters.moves += 1
                    self.sim.counters.energy_consumed += 0.5

        terminated = self.steps >= self.max_steps
        truncated = False
        reward = -0.1
        info = {"events": []}

        return self._get_obs(), reward, terminated, truncated, info

    def render(self):
        pass

    def close(self):
        pass