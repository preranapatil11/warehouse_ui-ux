"""Episode recording and replay."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any
import json


@dataclass
class Frame:
    """Single frame of an episode replay."""

    step: int
    grid: list[list[int]]
    robots: list[dict[str, Any]]
    packages: list[dict[str, Any]]
    events: list[str] = field(default_factory=list)
    reward: float = 0.0
    reward_components: dict[str, float] | None = None


class EpisodeRecorder:
    """Records an episode for later replay."""

    def __init__(self, layout: Any, controller: str, seed: int):
        self.layout = layout
        self.controller = controller
        self.seed = seed
        self.frames: list[Frame] = []
        self.extra: dict[str, Any] = {}

    @classmethod
    def for_simulation(cls, sim: Any, controller: str, seed: int) -> EpisodeRecorder:
        layout_dict = sim.layout.to_dict() if hasattr(sim, "layout") else {}
        return cls(layout_dict, controller, seed)

    def capture(
        self,
        sim: Any,
        events: list[str] | None = None,
        reward: float = 0.0,
        reward_components: dict[str, float] | None = None,
    ) -> None:
        """Capture current simulation state."""
        if not hasattr(sim, "layout"):
            return

        grid = [list(row) for row in sim.layout.grid]
        robots = []
        if hasattr(sim, "robots"):
            for robot in sim.robots:
                robots.append({
                    "id": robot.id,
                    "x": robot.x,
                    "y": robot.y,
                    "battery": robot.battery,
                    "carrying": getattr(robot, "carrying", None),
                    "target": getattr(robot, "target", None),
                    "status": getattr(robot, "status", "idle"),
                    "distance_travelled": getattr(robot, "distance_travelled", 0),
                    "deliveries_completed": getattr(robot, "deliveries_completed", 0),
                    "algorithm": getattr(robot, "algorithm", "unknown"),
                })
        packages = []
        if hasattr(sim, "packages"):
            for pkg in sim.packages:
                packages.append({
                    "id": pkg.id,
                    "x": pkg.x,
                    "y": pkg.y,
                    "destination": pkg.destination,
                    "delivered": getattr(pkg, "delivered", False),
                    "assigned_robot": getattr(pkg, "assigned_robot", None),
                })

        frame = Frame(
            step=len(self.frames),
            grid=grid,
            robots=robots,
            packages=packages,
            events=events or [],
            reward=reward,
            reward_components=reward_components,
        )
        self.frames.append(frame)

    def finalise(self, sim: Any, extra: dict[str, Any] | None = None) -> None:
        """Finalise recording with summary data."""
        self.extra = extra or {}

    def to_dict(self) -> dict[str, Any]:
        return {
            "scenario": self.layout.get("name", "unknown"),
            "controller": self.controller,
            "seed": self.seed,
            "frames": [
                {
                    "step": f.step,
                    "grid": f.grid,
                    "robots": f.robots,
                    "packages": f.packages,
                    "events": f.events,
                    "reward": f.reward,
                    "reward_components": f.reward_components,
                }
                for f in self.frames
            ],
            "summary": self.extra,
        }

    def save(self, path: str) -> None:
        """Save recording to JSON file."""
        with open(path, "w", encoding="utf-8") as f:
            json.dump(self.to_dict(), f, indent=2)