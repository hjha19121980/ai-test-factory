import { SourceType } from '../services/test-run.service';

export interface IntakeModel {
  sourceType: SourceType;
  sourceValue: string;
  repository: string;
  repositoryLocation: string;
  branch: string;
  testOutputPath: string;
  existingTestFilePath: string;
  preserveExistingTests: boolean;
  notes: string;
  documentMode: 'attachment' | 'confluence';
  documentFileName: string;
}

export interface McpServerModel {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  selected: boolean;
  started: boolean;
}

export interface WorkflowStepModel {
  id: string;
  number: string;
  label: string;
  status: 'pending' | 'active' | 'complete' | 'blocked';
  message: string;
}

export interface ActivityLogEntry {
  time: string;
  message: string;
}
