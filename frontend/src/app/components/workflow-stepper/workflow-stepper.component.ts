import { UpperCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivityLogEntry, WorkflowStepModel } from '../../models/ui.models';

@Component({ selector: 'app-workflow-stepper', imports: [UpperCasePipe], templateUrl: './workflow-stepper.component.html', styleUrl: './workflow-stepper.component.scss' })
export class WorkflowStepperComponent {
  @Input({ required: true }) steps!: WorkflowStepModel[];
  @Input({ required: true }) activityLog!: ActivityLogEntry[];
  @Input({ required: true }) runId: string | undefined;
  @Input({ required: true }) planState!: string;
  get currentActivity(): string { return this.steps.find((step) => step.status === 'active')?.message ?? 'Run paused'; }
}
