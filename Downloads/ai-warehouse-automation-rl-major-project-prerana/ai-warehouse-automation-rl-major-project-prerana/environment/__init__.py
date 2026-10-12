"""Gymnasium environment for warehouse simulation."""

from typing import Any

from .warehouse_env import WarehouseEnv

def make_env(config: Any, layout: Any = None) -> WarehouseEnv:
    """Create a warehouse environment."""
    return WarehouseEnv(config, layout)

__all__ = ["WarehouseEnv", "make_env"]