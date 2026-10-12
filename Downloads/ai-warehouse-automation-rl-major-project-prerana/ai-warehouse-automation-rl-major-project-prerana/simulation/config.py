"""Scenario configuration for warehouse simulations."""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any
import yaml


@dataclass(frozen=True)
class BatteryConfig:
    start_level: int = 100
    consumption_per_step: float = 0.5
    charge_rate: float = 10.0
    low_threshold: int = 20
    critical_threshold: int = 10


@dataclass(frozen=True)
class ObstacleConfig:
    n_dynamic: int = 0
    dynamic_speed: float = 1.0


@dataclass(frozen=True)
class TaskConfig:
    tasks_per_episode: int = 10
    task_timeout: int = 200


@dataclass(frozen=True)
class RewardConfig:
    step_penalty: float = -0.1
    delivery_reward: float = 10.0
    collision_penalty: float = -5.0
    battery_depleted_penalty: float = -20.0
    idle_penalty: float = -0.05


@dataclass(frozen=True)
class ScenarioConfig:
    name: str
    description: str
    layout: WarehouseLayout
    max_steps: int = 500
    battery: BatteryConfig = field(default_factory=BatteryConfig)
    obstacles: ObstacleConfig = field(default_factory=ObstacleConfig)
    tasks: TaskConfig = field(default_factory=TaskConfig)
    reward: RewardConfig = field(default_factory=RewardConfig)

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> ScenarioConfig:
        from .warehouse import WarehouseLayout
        layout_data = data.get("layout")
        if isinstance(layout_data, dict):
            layout = WarehouseLayout.from_dict(layout_data)
        else:
            layout = WarehouseLayout(
                width=10,
                height=10,
                grid=tuple(tuple(row) for row in layout_data) if layout_data else tuple(),
            )
        return cls(
            name=data.get("name", "default"),
            description=data.get("description", ""),
            layout=layout,
            max_steps=data.get("max_steps", 500),
            battery=BatteryConfig(**data.get("battery", {})),
            obstacles=ObstacleConfig(**data.get("obstacles", {})),
            tasks=TaskConfig(**data.get("tasks", {})),
            reward=RewardConfig(**data.get("reward", {})),
        )


def load_scenario(path: Path) -> ScenarioConfig:
    """Load a scenario from a YAML file."""
    with path.open("r", encoding="utf-8") as f:
        data = yaml.safe_load(f)
    return ScenarioConfig.from_dict(data)


def create_default_scenarios() -> dict[str, ScenarioConfig]:
    """Create default scenario configurations."""
    from .warehouse import default_layout

    layout = default_layout()

    return {
        "default": ScenarioConfig(
            name="default",
            description="Standard warehouse layout with static shelves.",
            layout=layout,
            max_steps=500,
        ),
        "simple_static": ScenarioConfig(
            name="simple_static",
            description="Simple layout with few static obstacles.",
            layout=layout,
            max_steps=300,
        ),
        "complex_static": ScenarioConfig(
            name="complex_static",
            description="Complex layout with many static obstacles.",
            layout=layout,
            max_steps=800,
        ),
        "dynamic_obstacles": ScenarioConfig(
            name="dynamic_obstacles",
            description="Layout with moving obstacles.",
            layout=layout,
            max_steps=600,
            obstacles=ObstacleConfig(n_dynamic=3),
        ),
        "battery_constrained": ScenarioConfig(
            name="battery_constrained",
            description="Layout with limited battery capacity.",
            layout=layout,
            max_steps=1000,
            battery=BatteryConfig(start_level=50, consumption_per_step=1.0),
        ),
    }