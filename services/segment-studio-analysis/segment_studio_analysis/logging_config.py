from __future__ import annotations

import logging
import sys

from pythonjsonlogger.json import JsonFormatter


def configure_logging(level: str) -> None:
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(
        JsonFormatter(
            "%(asctime)s %(levelname)s %(name)s %(message)s "
            "%(requestId)s %(runId)s %(phase)s %(phaseStartedAt)s "
            "%(elapsedSeconds)s %(errorCode)s %(failedPhase)s %(retryable)s "
            "%(upstreamHttpStatus)s %(upstreamErrorCode)s"
        )
    )
    root = logging.getLogger()
    root.handlers.clear()
    root.addHandler(handler)
    root.setLevel(level)
    # Keep dependency request logging from exposing configured upstream URLs.
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("httpcore").setLevel(logging.WARNING)
