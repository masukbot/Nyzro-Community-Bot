# ╔══════════════════════════════════════════════════════════════════╗
# ║                                                                  ║
# ║   ░█▀▀░█▀█░█▀▄░█▀▀░█░█   ░█▀▄░█▀▀░█░█░█▀▀                     ║
# ║   ░█░░░█░█░█░█░█▀▀░▄▀▄   ░█░█░█▀▀░▀▄▀░▀▀█                     ║
# ║   ░▀▀▀░▀▀▀░▀▀░░▀▀▀░▀░▀   ░▀▀░░▀▀▀░░▀░░▀▀▀                     ║
# ║                                                                  ║
# ║            © 2026 CodeX Devs — All Rights Reserved               ║
# ║                                                                  ║
# ║   discord  ──  https://discord.gg/codexdev                      ║
# ║   youtube  ──  https://youtube.com/@CodeXDevs                   ║
# ║   github   ──  https://github.com/RayExo                        ║
# ║                                                                  ║
# ╚══════════════════════════════════════════════════════════════════╝

"""
Nyzro AI Management System
A multi-provider AI orchestration platform with failover, cost tracking, and feature-based assignment.
"""

from ai.manager import AIManager
from ai.providers.builtins import PROVIDERS, get_provider_class, list_providers
from ai.models import ModelRegistry, ModelDefinition
from ai.features import FeatureRegistry, FEATURES, FeatureDefinition
from ai.failover import FailoverEngine

__all__ = [
    "AIManager",
    "PROVIDERS",
    "get_provider_class",
    "list_providers",
    "ModelRegistry",
    "ModelDefinition",
    "FeatureRegistry",
    "FEATURES",
    "FeatureDefinition",
    "FailoverEngine",
]
