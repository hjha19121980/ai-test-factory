import { Injectable } from '@angular/core';

export type SourceType = 'jira' | 'document' | 'github';

export interface McpServerConfigEntry {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  enabled: boolean;
  required: boolean;
  notes?: string;
}

export interface McpServerConfigFile {
  version: string;
  lastUpdated: string;
  servers: McpServerConfigEntry[];
}

export interface ModelSettingsConfig {
  version: string;
  lastUpdated: string;
  selectedModel: string;
  availableModels: string[];
}

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

  async loadMcpServers(): Promise<McpServerConfigEntry[]> {
    const response = await fetch(`${this.apiUrl}/mcp-servers`, { method: 'GET' });
    if (!response.ok) {
      throw new Error('The MCP server configuration could not be loaded.');
    }

    const payload = await response.json() as McpServerConfigFile;
    return payload.servers ?? [];
  }

  async saveMcpServers(servers: McpServerConfigEntry[]): Promise<McpServerConfigFile> {
    const payload: McpServerConfigFile = {
      version: '1.0',
      lastUpdated: new Date().toISOString(),
      servers
    };

    const response = await fetch(`${this.apiUrl}/mcp-servers`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('The MCP server configuration could not be saved.');
    }

    return response.json() as Promise<McpServerConfigFile>;
  }

  async loadModelSettings(): Promise<ModelSettingsConfig> {
    const response = await fetch(`${this.apiUrl}/model-settings`, { method: 'GET' });
    if (!response.ok) {
      throw new Error('The model settings could not be loaded.');
    }

    return response.json() as Promise<ModelSettingsConfig>;
  }

  async saveModelSettings(config: ModelSettingsConfig): Promise<ModelSettingsConfig> {
    const response = await fetch(`${this.apiUrl}/model-settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });

    if (!response.ok) {
      throw new Error('The model settings could not be saved.');
    }

    return response.json() as Promise<ModelSettingsConfig>;
  }
}
