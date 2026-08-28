# Backend

The local workflow API is implemented in `app.py` using Python's standard library.

## Claude configuration

Install the official Anthropic SDK:

```powershell
pip install -r requirements.txt
```

Set the key in the backend process environment. Do not put it in Angular, source files, or committed configuration:

```powershell
$env:ANTHROPIC_API_KEY = 'your-api-key'
$env:CLAUDE_MODEL = 'claude-sonnet-4-5'
```

`claude_provider.py` owns the Claude connection. `agent_service.py` supplies separate prompts for planner, unit, integration, API, UI, accessibility, performance, and reviewer work. The model endpoint is `POST /runs/{runId}/agent-runs` and requires the run to be approved first:

```json
{
	"agent": "planner",
	"prompt": "Return an editable QA plan for the approved intake.",
	"maxTokens": 4096
}
```

The API returns HTTP 503 when the SDK or key is not configured, without exposing the key.

Run it from this directory:

```powershell
python app.py
```

The API listens on `http://127.0.0.1:8000` and exposes `POST /runs`, `GET /runs/{runId}`, and `POST /runs/{runId}/approval`.

Run domain tests:

```powershell
python -m unittest discover
```
