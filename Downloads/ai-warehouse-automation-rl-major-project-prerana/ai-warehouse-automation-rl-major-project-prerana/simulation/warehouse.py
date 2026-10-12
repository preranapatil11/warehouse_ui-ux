"""Warehouse layout and cell definitions."""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import IntEnum
from typing import Any


class CellType(IntEnum):
    """Cell types in the warehouse grid."""

    EMPTY = 0
    WALL = 1
    SHELF = 2
    STORAGE = 3
    PACKING = 4
    CHARGING = 5
    ENTRY = 6
    EXIT = 7


#: Maximum size for user-drawn custom layouts.
MAX_CUSTOM_SIZE = 50


@dataclass(frozen=True)
class WarehouseLayout:
    """Immutable warehouse layout."""

    width: int
    height: int
    grid: tuple[tuple[int, ...], ...]
    robots: tuple[RobotPosition, ...] = field(default_factory=tuple)
    packages: tuple[PackagePosition, ...] = field(default_factory=tuple)
    storage: tuple[Position, ...] = field(default_factory=tuple)
    packing: tuple[Position, ...] = field(default_factory=tuple)
    charging: tuple[Position, ...] = field(default_factory=tuple)
    entry: tuple[Position, ...] = field(default_factory=tuple)
    exit: tuple[Position, ...] = field(default_factory=tuple)

    def to_dict(self) -> dict[str, Any]:
        return {
            "width": self.width,
            "height": self.height,
            "grid": [list(row) for row in self.grid],
            "robots": [{"id": r.id, "x": r.x, "y": r.y, "battery": r.battery} for r in self.robots],
            "packages": [{"id": p.id, "x": p.x, "y": p.y, "destination": p.destination} for p in self.packages],
            "storage": [{"x": s.x, "y": s.y} for s in self.storage],
            "packing": [{"x": s.x, "y": s.y} for s in self.packing],
            "charging": [{"x": s.x, "y": s.y} for s in self.charging],
            "entry": [{"x": s.x, "y": s.y} for s in self.entry],
            "exit": [{"x": s.x, "y": s.y} for s in self.exit],
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> WarehouseLayout:
        return cls(
            width=data["width"],
            height=data["height"],
            grid=tuple(tuple(row) for row in data["grid"]),
            robots=tuple(RobotPosition(**r) for r in data.get("robots", [])),
            packages=tuple(PackagePosition(**p) for p in data.get("packages", [])),
            storage=tuple(Position(**s) for s in data.get("storage", [])),
            packing=tuple(Position(**s) for s in data.get("packing", [])),
            charging=tuple(Position(**s) for s in data.get("charging", [])),
            entry=tuple(Position(**s) for s in data.get("entry", [])),
            exit=tuple(Position(**s) for s in data.get("exit", [])),
        )


@dataclass(frozen=True)
class Position:
    x: int
    y: int


@dataclass(frozen=True)
class RobotPosition:
    id: str
    x: int
    y: int
    battery: int = 100


@dataclass(frozen=True)
class PackagePosition:
    id: str
    x: int
    y: int
    destination: str


def layout_from_grid(grid: list[list[int]]) -> WarehouseLayout:
    """Create a WarehouseLayout from a raw grid of cell integers."""
    if not grid or not grid[0]:
        raise ValueError("grid must not be empty")
    height = len(grid)
    width = len(grid[0])
    if any(len(row) != width for row in grid):
        raise ValueError("all rows must have the same length")
    if width > MAX_CUSTOM_SIZE or height > MAX_CUSTOM_SIZE:
        raise ValueError(f"grid must be at most {MAX_CUSTOM_SIZE}x{MAX_CUSTOM_SIZE}")

    robots: list[RobotPosition] = []
    packages: list[PackagePosition] = []
    storage: list[Position] = []
    packing: list[Position] = []
    charging: list[Position] = []
    entry: list[Position] = []
    exit_: list[Position] = []

    for y, row in enumerate(grid):
        for x, cell in enumerate(row):
            if cell == CellType.STORAGE:
                storage.append(Position(x, y))
            elif cell == CellType.PACKING:
                packing.append(Position(x, y))
            elif cell == CellType.CHARGING:
                charging.append(Position(x, y))
            elif cell == CellType.ENTRY:
                entry.append(Position(x, y))
            elif cell == CellType.EXIT:
                exit_.append(Position(x, y))

    return WarehouseLayout(
        width=width,
        height=height,
        grid=tuple(tuple(row) for row in grid),
        robots=tuple(robots),
        packages=tuple(packages),
        storage=tuple(storage),
        packing=tuple(packing),
        charging=tuple(charging),
        entry=tuple(entry),
        exit=tuple(exit_),
    )


def default_layout() -> WarehouseLayout:
    """Create a default warehouse layout for testing."""
    grid = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 2, 2, 0, 0, 0, 1],
        [1, 0, 0, 0, 2, 2, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 3, 0, 0, 0, 0, 0, 0, 4, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 5, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 6, 0, 0, 0, 0, 0, 0, 7, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ]
    return layout_from_grid(grid)