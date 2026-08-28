"""Minimal approval-gated QA workflow API for local development."""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any
from uuid import uuid4

from agent_service import AgentRequest, AgentService
from claude_provider import ClaudeProviderError


ALLOWED_TRANSITIONS = {
    "intake": {"inspecting"},
    "inspecting": {"plan_ready"},
    "plan_ready": {"awaiting_approval"},
    "awaiting_approval": {"approved", "plan_rejected"},
    "approved": {"generating"},
}


@dataclass
class Run:
    run_id: str
    source_type: str
    source_value: str
    repository: str = ""
    repository_location: str = ""
    branch: str = "main"
    test_output_path: str = ""
    existing_test_file_path: str = ""
    preserve_existing_tests: bool = True
    notes: str = ""
    mcp_servers: list[dict[str, str]] = field(default_factory=list)
    test_types: list[str] = field(default_factory=list)
    state: str = "awaiting_approval"
    approval_history: list[dict[str, Any]] = field(default_factory=list)

    def transition(self, target: str, actor: str = "system") -> None:
        if target not in ALLOWED_TRANSITIONS.get(self.state, set()):
            raise ValueError(f"Invalid transition from {self.state} to {target}")
        self.state = target
        self.approval_history.append({"state": target, "actor": actor})


class RunStore:
    def __init__(self) -> None:
        self._runs: dict[str, Run] = {}

    def create(self, payload: dict[str, Any]) -> Run:
        required = ("sourceType", "sourceValue")
        if any(not isinstance(payload.get(key), str) or not payload[key].strip() for key in required):
            raise ValueError("sourceType and sourceValue are required")
        run = Run(
            run_id=str(uuid4()),
            source_type=payload["sourceType"],
            source_value=payload["sourceValue"],
            repository=str(payload.get("repository", "")),
            repository_location=str(payload.get("repositoryLocation", "")),
            branch=str(payload.get("branch", "main")),
            test_output_path=str(payload.get("testOutputPath", "")),
            existing_test_file_path=str(payload.get("existingTestFilePath", "")),
            preserve_existing_tests=bool(payload.get("preserveExistingTests", True)),
            notes=str(payload.get("notes", "")),
            mcp_servers=list(payload.get("mcpServers", [])),
            test_types=list(payload.get("testTypes", [])),
        )
        self._runs[run.run_id] = run
        return run

    def get(self, run_id: str) -> Run | None:
        return self._runs.get(run_id)


store = RunStore()


def serialize_run(run: Run) -> dict[str, Any]:
    return {
        "runId": run.run_id,
        "sourceType": run.source_type,
        "sourceValue": run.source_value,
        "repository": run.repository,
        "repositoryLocation": run.repository_location,
        "branch": run.branch,
        "testOutputPath": run.test_output_path,
        "existingTestFilePath": run.existing_test_file_path,
        "preserveExistingTests": run.preserve_existing_tests,
        "notes": run.notes,
        "mcpServers": run.mcp_servers,
        "testTypes": run.test_types,
        "state": run.state,
        "approvalHistory": run.approval_history,
    }


class RequestHandler(BaseHTTPRequestHandler):
    def _send(self, status: int, payload: dict[str, Any]) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "http://localhost:4200")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "http://localhost:4200")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.end_headers()

    def do_POST(self) -> None:
        if self.path == "/runs":
            try:
                size = int(self.headers.get("Content-Length", "0"))
                payload = json.loads(self.rfile.read(size))
                run = store.create(payload)
            except (ValueError, json.JSONDecodeError) as error:
                self._send(400, {"error": str(error)})
                return
            self._send(201, serialize_run(run))
            return

        prefix = "/runs/"
        agent_suffix = "/agent-runs"
        if self.path.startswith(prefix) and self.path.endswith(agent_suffix):
            run_id = self.path[len(prefix) : -len(agent_suffix)]
            run = store.get(run_id)
            if run is None:
                self._send(404, {"error": "Run not found"})
                return
            if run.state not in {"approved", "generating"}:
                self._send(409, {"error": "The plan must be approved before an agent can run"})
                return
            try:
                size = int(self.headers.get("Content-Length", "0"))
                payload = json.loads(self.rfile.read(size))
                request = AgentRequest(
                    agent=str(payload.get("agent", "")),
                    prompt=str(payload.get("prompt", "")),
                    max_tokens=int(payload.get("maxTokens", 4096)),
                )
                if not request.prompt.strip():
                    raise ValueError("prompt is required")
                output = AgentService().run(request)
                if run.state == "approved":
                    run.transition("generating", "orchestrator")
            except (ValueError, TypeError, json.JSONDecodeError) as error:
                self._send(400, {"error": str(error)})
                return
            except ClaudeProviderError as error:
                self._send(503, {"error": str(error)})
                return
            self._send(200, {"runId": run_id, "agent": request.agent, "output": output, "state": run.state})
            return

        suffix = "/approval"
        if self.path.startswith(prefix) and self.path.endswith(suffix):
            run_id = self.path[len(prefix) : -len(suffix)]
            run = store.get(run_id)
            if run is None:
                self._send(404, {"error": "Run not found"})
                return
            try:
                size = int(self.headers.get("Content-Length", "0"))
                payload = json.loads(self.rfile.read(size))
                decision = payload.get("decision")
                target = "approved" if decision == "approve" else "plan_rejected" if decision == "reject" else ""
                run.transition(target, str(payload.get("actor", "user")))
            except (ValueError, json.JSONDecodeError) as error:
                self._send(400, {"error": str(error)})
                return
            self._send(200, serialize_run(run))
            return

        self._send(404, {"error": "Not found"})

    def do_GET(self) -> None:
        prefix = "/runs/"
        if self.path.startswith(prefix):
            run = store.get(self.path[len(prefix) :])
            if run is None:
                self._send(404, {"error": "Run not found"})
                return
            self._send(200, serialize_run(run))
            return
        self._send(404, {"error": "Not found"})

    def log_message(self, format: str, *args: Any) -> None:
        return


def serve(host: str = "127.0.0.1", port: int = 8000) -> None:
    ThreadingHTTPServer((host, port), RequestHandler).serve_forever()


if __name__ == "__main__":
    serve()
