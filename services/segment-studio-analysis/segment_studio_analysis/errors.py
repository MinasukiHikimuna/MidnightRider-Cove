from __future__ import annotations

from dataclasses import dataclass


@dataclass
class ServiceError(Exception):
    code: str
    title: str
    status: int
    detail: str
    retryable: bool = False
    request_id: str | None = None

    def problem(self) -> dict[str, object]:
        result: dict[str, object] = {
            "type": f"https://segment-studio.invalid/problems/{self.code.replace('_', '-')}",
            "title": self.title,
            "status": self.status,
            "code": self.code,
            "retryable": self.retryable,
            "detail": self.detail,
        }
        if self.request_id:
            result["requestId"] = self.request_id
        return result


def invalid_request(detail: str = "The request is invalid.") -> ServiceError:
    return ServiceError("invalid_request", "Invalid request", 400, detail)
