"""Task management service for the warehouse dashboard.

Tasks are persisted as JSON files in the data/tasks directory so that
task state survives a page refresh.  Each task references a warehouse
location by name; the mapping from location name to grid coordinates is
resolved against the currently active scenario layout.
"""

from __future__ import annotations

import json
import os
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from backend.services import simulation_service as service
from simulation.warehouse import WarehouseLayout

#: Directory where task JSON files are stored.
TASKS_DIR = Path(os.getenv("WAREHOUSE_TASKS_DIR", service.REPO_ROOT / "data" / "tasks"))

#: Valid task types and the (from, to) semantics they imply.
TASK_TYPES = ("pickup", "delivery", "restock", "charge")

#: Valid task statuses.
TASK_STATUSES = ("pending", "assigned", "in_progress", "completed", "failed")

#: Valid priorities.
TASK_PRIORITIES = ("low", "medium", "high")


class TaskError(Exception):
    """Raised for conditions the API turns into a 4xx response."""


def _ensure_dir() -> None:
    TASKS_DIR.mkdir(parents=True, exist_ok=True)


def _task_path(task_id: str) -> Path:
    return (TASKS_DIR / f"{task_id}.json").resolve()


def _list_task_files() -> list[Path]:
    if not TASKS_DIR.exists():
        return []
    return sorted(TASKS_DIR.glob("*.json"))


def list_tasks() -> list[dict[str, Any]]:
    """Return every persisted task, newest first."""
    _ensure_dir()
    tasks = []
    for path in _list_task_files():
        try:
            with path.open("r", encoding="utf-8") as handle:
                tasks.append(json.load(handle))
        except (OSError, json.JSONDecodeError):
            continue
    tasks.sort(key=lambda t: t.get("created_at", ""), reverse=True)
    return tasks


def get_task(task_id: str) -> dict[str, Any]:
    path = _task_path(task_id)
    if not path.is_file():
        raise TaskError(f"unknown task {task_id!r}")
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def _resolve_location(name: str, layout: WarehouseLayout) -> dict[str, Any] | None:
    """Resolve a human-readable location name to grid coordinates."""
    if not name:
        return None
    lowered = name.lower()
    for group, cells in (
        ("storage", layout.storage),
        ("packing", layout.packing),
        ("charging", layout.charging),
        ("entry", layout.entry),
        ("exit", layout.exit),
    ):
        for cell in cells:
            if f"{group} {cell.x}-{cell.y}" == lowered or f"{group} {cell.x},{cell.y}" == lowered:
                return {"x": cell.x, "y": cell.y, "name": name}
    return None


def create_task(
    task_type: str,
    from_location: str,
    to_location: str,
    priority: str = "medium",
    assigned_robot: str | None = None,
    estimated_minutes: int | None = None,
) -> dict[str, Any]:
    """Create and persist a new task."""
    if task_type not in TASK_TYPES:
        raise TaskError(f"unknown task type {task_type!r}")
    if priority not in TASK_PRIORITIES:
        raise TaskError(f"unknown priority {priority!r}")

    _ensure_dir()
    # Validate robot assignment against the default scenario layout.
    if assigned_robot:
        try:
            layout = service.get_layout("default")
            layout_obj = WarehouseLayout.from_dict(layout)
            robot_ids = {r["id"] for r in layout_obj.robots}
            if assigned_robot not in robot_ids:
                # Allow any robot_ id; the simulator may add more.
                if not assigned_robot.startswith("robot_"):
                    raise TaskError(f"invalid robot id {assigned_robot!r}")
        except service.ServiceError:
            pass

    task_id = f"TSK-{uuid.uuid4().hex[:6].upper()}"
    now = datetime.now(timezone.utc).isoformat()
    task = {
        "id": task_id,
        "type": task_type.capitalize(),
        "from": from_location,
        "to": to_location,
        "priority": priority.capitalize(),
        "status": "pending",
        "assignedRobot": assigned_robot,
        "createdAt": now,
        "created_at": now,
        "estimatedTime": f"{estimated_minutes} min" if estimated_minutes else None,
        "estimated_minutes": estimated_minutes,
    }
    path = _task_path(task_id)
    with path.open("w", encoding="utf-8") as handle:
        json.dump(task, handle, indent=2)
    return task


def update_task(task_id: str, **updates: Any) -> dict[str, Any]:
    """Update fields of an existing task."""
    task = get_task(task_id)
    if "status" in updates and updates["status"] not in TASK_STATUSES:
        raise TaskError(f"unknown status {updates['status']!r}")
    if "priority" in updates and updates["priority"].lower() not in TASK_PRIORITIES:
        raise TaskError(f"unknown priority {updates['priority']!r}")
    for key, value in updates.items():
        task[key] = value
    path = _task_path(task_id)
    with path.open("w", encoding="utf-8") as handle:
        json.dump(task, handle, indent=2)
    return task


def delete_task(task_id: str) -> None:
    path = _task_path(task_id)
    if not path.is_file():
        raise TaskError(f"unknown task {task_id!r}")
    path.unlink()


def task_summary() -> dict[str, int]:
    """Aggregate counts by status for the dashboard."""
    tasks = list_tasks()
    return {
        "total": len(tasks),
        "pending": sum(1 for t in tasks if t.get("status") == "pending"),
        "assigned": sum(1 for t in tasks if t.get("status") == "assigned"),
        "in_progress": sum(1 for t in tasks if t.get("status") == "in_progress"),
        "completed": sum(1 for t in tasks if t.get("status") == "completed"),
        "failed": sum(1 for t in tasks if t.get("status") == "failed"),
    }