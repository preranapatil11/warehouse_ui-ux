"""RL agent evaluation utilities."""

from __future__ import annotations

from typing import Any
import numpy as np


class PPOPolicy:
    """PPO policy wrapper for evaluation."""

    def __init__(self, model: Any):
        self.model = model
        self.name = "ppo"

    @classmethod
    def load(cls, path: str) -> PPOPolicy:
        """Load a trained PPO model."""
        try:
            from stable_baselines3 import PPO
            model = PPO.load(path)
            return cls(model)
        except Exception as e:
            raise RuntimeError(f"Failed to load PPO model from {path}: {e}")

    def reset(self, env: Any, seed: int) -> None:
        pass

    def act(self, observation: np.ndarray, env: Any) -> int:
        action, _ = self.model.predict(observation, deterministic=True)
        return int(action)