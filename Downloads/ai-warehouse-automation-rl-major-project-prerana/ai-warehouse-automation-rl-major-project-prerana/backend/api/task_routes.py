"""HTTP routes for task management."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

from backend.services import task_service

router = APIRouter()


class TaskCreateRequest(BaseModel):
    """Body of ``POST /api/tasks``."""

    type: str = Field(..., description="pickup | delivery | restock | charge")
    from_location: str = Field(..., alias="from", description="source location name")
    to_location: str = Field(..., alias="to", description="destination location name")
    priority: str = Field(default="medium")
    assigned_robot: str | None = Field(default=None)
    estimated_minutes: int | None = Field(default=None, ge=1, le=480)

    model_config = {"populate_by_name": True}


class TaskUpdateRequest(BaseModel):
    """Body of ``PATCH /api/tasks/{id}``."""

    status: str | None = None
    priority: str | None = None
    assigned_robot: str | None = None
    estimated_minutes: int | None = Field(default=None, ge=1, le=480)


def _handle(call, *args, **kwargs):
    try:
        return call(*args, **kwargs)
    except task_service.TaskError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/tasks")
def list_tasks() -> list[dict[str, Any]]:
    return _handle(task_service.list_tasks)


@router.get("/tasks/summary")
def task_summary() -> dict[str, Any]:
    return _handle(task_service.task_summary)


@router.get("/tasks/{task_id}")
def get_task(task_id: str) -> dict[str, Any]:
    return _handle(task_service.get_task, task_id)


@router.post("/tasks", status_code=201)
def create_task(request: TaskCreateRequest) -> dict[str, Any]:
    return _handle(
        task_service.create_task,
        request.type,
        request.from_location,
        request.to_location,
        request.priority,
        request.assigned_robot,
        request.estimated_minutes,
    )


@router.patch("/tasks/{task_id}")
def update_task(task_id: str, request: TaskUpdateRequest) -> dict[str, Any]:
    updates = request.model_dump(exclude_none=True)
    if "estimated_minutes" in updates:
        updates["estimatedTime"] = (
            f"{updates['estimated_minutes']} min" if updates["estimated_minutes"] else None
        )
    return _handle(task_service.update_task, task_id, **updates)


@router.delete("/tasks/{task_id}")
def delete_task(task_id: str) -> dict[str, str]:
    _handle(task_service.delete_task, task_id)
    return {"status": "deleted"}