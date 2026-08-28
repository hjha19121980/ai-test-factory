import { Injectable } from '@angular/core';

export type SourceType = 'jira' | 'document' | 'github';

export interface CreateRunRequest {
  sourceType: SourceType;
  sourceValue: string;
  repository: string;
  repositoryLocation: string;
  branch: string;
  testOutputPath: string;
  existingTestFilePath: string;
  preserveExistingTests: boolean;
  notes: string;
  mcpServers: Array<{ id: string; name: string; endpoint: string }>;
  testTypes: string[];
}

export interface RunResponse extends CreateRunRequest {
  runId: string;
  state: 'awaiting_approval' | 'approved' | 'plan_rejected' | string;
  approvalHistory: Array<{ state: string; actor: string }>;
}

@Injectable({ providedIn: 'root' })
export class TestRunService {
  private readonly apiUrl = 'http://127.0.0.1:8000';

  async createRun(request: CreateRunRequest): Promise<RunResponse> {
    const response = await fetch(`${this.apiUrl}/runs`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(request) });
    if (!response.ok) throw new Error('The Planner service could not accept this intake.');
    return response.json() as Promise<RunResponse>;
  }

  async decidePlan(runId: string, decision: 'approve' | 'reject'): Promise<RunResponse> {
    const response = await fetch(`${this.apiUrl}/runs/${runId}/approval`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ decision }) });
    if (!response.ok) throw new Error('The Planner could not record this decision.');
    return response.json() as Promise<RunResponse>;
  }
}
