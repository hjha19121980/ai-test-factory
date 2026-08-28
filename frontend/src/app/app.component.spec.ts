/// <reference types="jasmine" />

import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RunResponse, TestRunService } from './services/test-run.service';

describe('AppComponent', () => {
  let testRunService: jasmine.SpyObj<TestRunService>;

  beforeEach(async () => {
    testRunService = jasmine.createSpyObj<TestRunService>('TestRunService', ['createRun', 'decidePlan']);
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [{ provide: TestRunService, useValue: testRunService }]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should change the selected source type', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    app.intake.sourceType = 'github';

    expect(app.intake.sourceType).toBe('github');
    expect(app.isSubmitted).toBeFalse();
  });

  it('should require selected MCP servers to be started before creating a planner', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    app.mcpServers[0].selected = true;
    expect(app.canCreatePlanner).toBeFalse();

    app.mcpServers[0].endpoint = 'http://localhost:9000';
    app.startMcpServers();

    expect(app.canCreatePlanner).toBeTrue();
  });

  it('should submit intake and expose the awaiting approval state', async () => {
    const run: RunResponse = {
      runId: 'run-123',
      sourceType: 'jira',
      sourceValue: 'PAY-482',
      repository: 'acme/payments',
      repositoryLocation: 'C:/work/payments',
      branch: 'main',
      testOutputPath: 'tests/api/refunds.spec.ts',
      existingTestFilePath: 'tests/api/refunds.spec.ts',
      preserveExistingTests: true,
      notes: '',
      mcpServers: [],
      testTypes: [],
      state: 'awaiting_approval',
      approvalHistory: []
    };
    testRunService.createRun.and.resolveTo(run);
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.intake.sourceValue = 'PAY-482';
    app.intake.repository = 'acme/payments';
    app.intake.repositoryLocation = 'C:/work/payments';
    app.intake.testOutputPath = 'tests/api/refunds.spec.ts';
    app.intake.existingTestFilePath = 'tests/api/refunds.spec.ts';

    await app.submitToPlanner();

    expect(testRunService.createRun).toHaveBeenCalledWith({
      sourceType: 'jira',
      sourceValue: 'PAY-482',
      repository: 'acme/payments',
      repositoryLocation: 'C:/work/payments',
      branch: 'main',
      testOutputPath: 'tests/api/refunds.spec.ts',
      existingTestFilePath: 'tests/api/refunds.spec.ts',
      preserveExistingTests: true,
      notes: '',
      mcpServers: [],
      testTypes: []
    });
    expect(app.run).toEqual(run);
    expect(app.isSubmitted).toBeTrue();
    expect(app.isSubmitting).toBeFalse();
    expect(app.workflowSteps[2].status).toBe('active');
    expect(app.activityLog[1].message).toContain('Planner draft is ready');
  });

  it('should advance the stepper and log approval', async () => {
    const run: RunResponse = {
      runId: 'run-123',
      sourceType: 'jira',
      sourceValue: 'PAY-482',
      repository: 'acme/payments',
      repositoryLocation: 'C:/work/payments',
      branch: 'main',
      testOutputPath: 'tests/api/refunds.spec.ts',
      existingTestFilePath: 'tests/api/refunds.spec.ts',
      preserveExistingTests: true,
      notes: '',
      mcpServers: [],
      testTypes: [],
      state: 'awaiting_approval',
      approvalHistory: []
    };
    const approvedRun = { ...run, state: 'approved' };
    testRunService.decidePlan.and.resolveTo(approvedRun);
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.run = run;

    await app.approvePlan();

    expect(app.planDecision).toBe('approved');
    expect(app.workflowSteps[3].status).toBe('active');
    expect(app.activityLog[0].message).toContain('Plan approved');
  });

  it('should report a service error without claiming intake succeeded', async () => {
    testRunService.createRun.and.rejectWith(new Error('offline'));
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.intake.sourceValue = 'PAY-482';

    await app.submitToPlanner();

    expect(app.isSubmitted).toBeFalse();
    expect(app.errorMessage).toContain('Planner is unavailable');
    expect(app.isSubmitting).toBeFalse();
  });
});
