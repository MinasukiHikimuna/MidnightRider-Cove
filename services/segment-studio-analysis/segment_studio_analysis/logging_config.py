from __future__ import annotations

import logging
import sys

from pythonjsonlogger.json import JsonFormatter


def configure_logging(level: str) -> None:
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(
        JsonFormatter(
            "%(asctime)s %(levelname)s %(name)s %(message)s "
            "%(requestId)s %(runId)s %(phase)s %(elapsedMilliseconds)s "
            "%(sourceFingerprint)s %(cacheHits)s %(selectedModels)s "
            "%(resultCounts)s %(errorCode)s"
        )
    )
    root = logging.getLogger()
    root.handlers.clear()
    root.addHandler(handler)
    root.setLevel(level)
