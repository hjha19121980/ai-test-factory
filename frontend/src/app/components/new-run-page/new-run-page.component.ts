import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { PlannerReviewComponent } from '../planner-review/planner-review.component';
import { SourceIntakeComponent } from '../source-intake/source-intake.component';
import { TestCoverageComponent } from '../test-coverage/test-coverage.component';
import { WorkflowStepperComponent } from '../workflow-stepper/workflow-stepper.component';
import { ActivityLogEntry, IntakeModel, McpServerModel, WorkflowStepModel } from '../../models/ui.models';
import { CreateRunRequest, McpServerConfigEntry, ModelSettingsConfig, RunResponse, TestRunService } from '../../services/test-run.service';

@Component({
  selector: 'app-new-run-page',
  standalone: true,
  imports: [FormsModule, SourceIntakeComponent, TestCoverageComponent, WorkflowStepperComponent, PlannerReviewComponent],
  templateUrl: './new-run-page.component.html',
  styleUrl: './new-run-page.component.scss'
})
export class NewRunPageComponent implements OnInit {
  availableModels = ['anthropic.claude-3-5-sonnet-20241022-v2:0'];
  selectedModel = this.availableModels[0];
  settingsOpen = false;

  readonly intake: IntakeModel = {
    sourceType: 'jira', sourceValue: '', repository: '', repositoryLocation: '', branch: 'main',
    testOutputPath: '', existingTestFilePath: '', preserveExistingTests: true, notes: '',
    documentMode: 'attachment', documentFileName: ''
  };
  mcpServers: McpServerModel[] = [
    { id: 'github', name: 'GitHub MCP', description: 'Pull requests, commits, files', endpoint: '', selected: false, started: false },
    { id: 'jira', name: 'Jira MCP', description: 'Stories, comments, acceptance criteria', endpoint: '', selected: false, started: false },
    { id: 'confluence', name: 'Confluence MCP', description: 'Requirement pages and attachments', endpoint: '', selected: false, started: false }
  ];

  selectedTestTypes = new Set<string>();
  plannerSummary = '';
  plannerCriteria = '';
  plannerState: 'intake' | 'planner' = 'intake';
  planDecision: 'awaiting_approval' | 'approved' | 'rejected' = 'awaiting_approval';
  workflowSteps: WorkflowStepModel[] = [
    { id: 'intake', number: '01', label: 'Intake', status: 'active', message: 'Waiting for source details.' },
    { id: 'mcp', number: '02', label: 'MCP connections', status: 'pending', message: 'Selected tools will be started before inspection.' },
    { id: 'planner', number: '03', label: 'Planner', status: 'pending', message: 'The orchestrator will prepare an editable plan.' },
    { id: 'generation', number: '04', label: 'Test generation', status: 'pending', message: 'Starts only after plan approval.' },
    { id: 'execution', number: '05', label: 'Execution', status: 'pending', message: 'Logs and evidence will appear here.' },
    { id: 'review', number: '06', label: 'Review', status: 'pending', message: 'Coverage and risks will be reviewed.' }
  ];
  activityLog: ActivityLogEntry[] = [];
  isSubmitted = false;
  isSubmitting = false;
  errorMessage = '';
  formSubmitted = false;
  run: RunResponse | null = null;

  constructor(private readonly testRunService: TestRunService) {}

  async ngOnInit(): Promise<void> {
    try {
      const modelSettings = await this.testRunService.loadModelSettings();
      this.syncModelSettings(modelSettings);
    } catch {
      this.errorMessage = 'Model settings could not be loaded from the shared configuration file.';
    }

    try {
      const servers = await this.testRunService.loadMcpServers();
      this.syncMcpServers(servers);
    } catch {
      this.errorMessage = 'MCP settings could not be loaded from the shared configuration file.';
    }
  }

  private syncModelSettings(settings: ModelSettingsConfig): void {
    if (settings.availableModels?.length) {
      this.availableModels = settings.availableModels;
    }

    if (settings.selectedModel && this.availableModels.includes(settings.selectedModel)) {
      this.selectedModel = settings.selectedModel;
    }
  }

  private persistModelSettings(): void {
    const payload: ModelSettingsConfig = {
      version: '1.0',
      lastUpdated: new Date().toISOString(),
      selectedModel: this.selectedModel,
      availableModels: this.availableModels
    };

    this.testRunService.saveModelSettings(payload).catch(() => {
      this.errorMessage = 'The model settings could not be saved to the shared configuration file.';
    });
  }

  private syncMcpServers(servers: McpServerConfigEntry[]): void {
    const serverMap = new Map(servers.map((server) => [server.id, server]));

    this.mcpServers = this.mcpServers.map((server) => {
      const config = serverMap.get(server.id);
      return {
        ...server,
        description: config?.description ?? server.description,
        endpoint: config?.endpoint ?? server.endpoint,
        selected: config?.enabled ?? server.selected,
        started: config?.enabled ?? server.started
      };
    });
  }

  private persistMcpServers(): void {
    const payload = this.mcpServers.map((server) => ({
      id: server.id,
      name: server.name,
      description: server.description,
      endpoint: server.endpoint,
      enabled: server.selected,
      required: false,
      notes: server.description
    }));

    this.testRunService.saveMcpServers(payload).catch(() => {
      this.errorMessage = 'The MCP settings could not be saved because the backend is not running. Start the backend service and try again.';
    });
  }

  private setWorkflowStep(stepId: string): void {
    const activeIndex = this.workflowSteps.findIndex((step) => step.id === stepId);
    this.workflowSteps = this.workflowSteps.map((step, index) => ({
      ...step,
      status: index < activeIndex ? 'complete' : index === activeIndex ? 'active' : 'pending'
    }));
  }

  private addActivity(message: string): void {
    this.activityLog = [...this.activityLog, { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), message }];
  }

  toggleSettings(): void {
    this.settingsOpen = !this.settingsOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as Node | null;
    const settingsWrap = document.querySelector('.settings-wrap');

    if (this.settingsOpen && settingsWrap && target && !settingsWrap.contains(target)) {
      this.settingsOpen = false;
    }
  }

  onModelChange(): void {
    this.persistModelSettings();
  }

  toggleMcpServer(server: McpServerModel): void {
    server.selected = !server.selected;
    server.started = false;
    this.persistMcpServers();
  }

  startMcpServers(): void {
    for (const server of this.mcpServers) {
      if (server.selected && server.endpoint.trim()) {
        server.started = true;
      }
    }
    this.persistMcpServers();
  }

  get selectedMcpServers() {
    return this.mcpServers.filter((server) => server.selected);
  }

  get canCreatePlanner(): boolean {
    return this.selectedMcpServers.every((server) => server.started);
  }

  get hasSelectedTestTypes(): boolean {
    return this.selectedTestTypes.size > 0;
  }

  async submitToPlanner(intakeForm?: NgForm): Promise<void> {
    this.formSubmitted = true;
    if (intakeForm && (!intakeForm.valid || !this.intake.sourceValue.trim() || !this.hasSelectedTestTypes)) {
      intakeForm.control.markAllAsTouched();
      this.errorMessage = this.hasSelectedTestTypes
        ? 'Please complete every required field before creating the planner.'
        : 'Choose at least one test type before creating the planner.';
      return;
    }
    const request: CreateRunRequest = {
      sourceType: this.intake.sourceType,
      sourceValue: this.intake.sourceValue,
      repository: this.intake.repository,
      repositoryLocation: this.intake.repositoryLocation,
      branch: this.intake.branch,
      testOutputPath: this.intake.testOutputPath,
      existingTestFilePath: this.intake.existingTestFilePath,
      preserveExistingTests: this.intake.preserveExistingTests,
      notes: this.intake.notes,
      mcpServers: this.selectedMcpServers.map(({ id, name, endpoint }) => ({ id, name, endpoint })),
      testTypes: Array.from(this.selectedTestTypes)
    };

    this.isSubmitting = true;
    this.errorMessage = '';
    try {
      this.run = await this.testRunService.createRun(request);
      this.setWorkflowStep('planner');
      this.addActivity('Intake accepted. Repository context queued for the Planner.');
      this.addActivity('Planner draft is ready for your review.');
      this.plannerSummary = `Review the requested ${request.testTypes.length || 'available'} test layer(s) for ${request.sourceValue}. Inspect existing tests in ${request.existingTestFilePath || 'the repository'} before updating the configured test destination ${request.testOutputPath || 'from project conventions'}. Confirm acceptance criteria, risks, and environment assumptions before generation.`;
      this.plannerCriteria = 'Map each acceptance criterion to an executable test and preserve evidence for every result.';
      this.plannerState = 'planner';
      this.isSubmitted = true;
    } catch {
      this.errorMessage = 'The Planner is unavailable. Start the backend and try again.';
    } finally {
      this.isSubmitting = false;
    }
  }

  async approvePlan(): Promise<void> {
    if (!this.run) return;
    try {
      this.run = await this.testRunService.decidePlan(this.run.runId, 'approve');
      this.planDecision = 'approved';
      this.setWorkflowStep('generation');
      this.addActivity('Plan approved. Specialist test generation is now unblocked.');
    } catch {
      this.errorMessage = 'The Planner could not record approval. Try again.';
    }
  }

  async rejectPlan(): Promise<void> {
    if (!this.run) return;
    try {
      this.run = await this.testRunService.decidePlan(this.run.runId, 'reject');
      this.planDecision = 'rejected';
      this.workflowSteps = this.workflowSteps.map((step) => step.status === 'active' ? { ...step, status: 'blocked', message: 'Plan rejected. Update the plan before continuing.' } : step);
      this.addActivity('Plan rejected. The run is paused for plan changes.');
    } catch {
      this.errorMessage = 'The Planner could not record rejection. Try again.';
    }
  }

  updatePlan(): void {
    this.errorMessage = '';
    this.planDecision = 'awaiting_approval';
  }
}
