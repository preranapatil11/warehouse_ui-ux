"""Baseline controllers for warehouse navigation."""

from __future__ import annotations

from typing import Any, Protocol
import numpy as np


class Policy(Protocol):
    """Protocol for controller policies."""

    name: str

    def reset(self, env: Any, seed: int) -> None: ...

    def act(self, observation: np.ndarray, env: Any) -> int: ...


class RandomPolicy:
    """Random action policy for baseline comparison."""

    def __init__(self, seed: int = 0):
        self.name = "random"
        self.rng = np.random.default_rng(seed)

    def reset(self, env: Any, seed: int) -> None:
        self.rng = np.random.default_rng(seed)

    def act(self, observation: np.ndarray, env: Any) -> int:
        return int(self.rng.integers(0, 5))


class PlannerPolicy:
    """Classical planner policy (A*, BFS)."""

    def __init__(self, planner: str = "astar"):
        self.name = planner
        self.planner = planner
        self._path: list[tuple[int, int]] = []
        self._path_index = 0

    def reset(self, env: Any, seed: int) -> None:
        self._path = []
        self._path_index = 0
        # In a real implementation, this would compute a path using A* or BFS
        # For now, we'll just use a simple heuristic

    def act(self, observation: np.ndarray, env: Any) -> int:
        # Simple heuristic: move towards target if available
        if hasattr(env, "sim") and env.sim and hasattr(env.sim, "robots") and env.sim.robots:
            robot = env.sim.robots[0]
            # Find nearest target (package, charging, etc.)
            # This is a simplified implementation
            if hasattr(robot, "target") and robot.target:
                # In real implementation, compute path to target
                pass

        # Fallback: random action for demo
        return int(np.random.randint(0, 5))

    def _compute_path(self, start: tuple[int, int], goal: tuple[int, int], grid: list[list[int]]) -> list[tuple[int, int]]:
        """Compute path using A* or BFS."""
        # Placeholder - real implementation would use heapq for A*
        return []