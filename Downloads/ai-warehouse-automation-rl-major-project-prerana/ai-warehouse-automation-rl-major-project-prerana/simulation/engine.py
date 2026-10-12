"""Simulation engine and counters."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass
class EpisodeCounters:
    """Counters tracked during an episode."""

    steps: int = 0
    moves: int = 0
    optimal_path_length: int = 0
    collisions: int = 0
    static_collisions: int = 0
    dynamic_collisions: int = 0
    idle_steps: int = 0
    energy_consumed: float = 0.0
    charging_events: int = 0
    tasks_delivered: int = 0
    tasks_failed: int = 0
    termination_reason: str = "unknown"

    def to_dict(self) -> dict[str, Any]:
        return {
            "steps": self.steps,
            "moves": self.moves,
            "optimal_path_length": self.optimal_path_length,
            "collisions": self.collisions,
            "static_collisions": self.static_collisions,
            "dynamic_collisions": self.dynamic_collisions,
            "idle_steps": self.idle_steps,
            "energy_consumed": self.energy_consumed,
            "charging_events": self.charging_events,
            "tasks_delivered": self.tasks_delivered,
            "tasks_failed": self.tasks_failed,
            "termination_reason": self.termination_reason,
        }