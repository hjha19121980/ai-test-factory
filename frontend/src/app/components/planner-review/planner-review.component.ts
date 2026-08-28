import { UpperCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({ selector: 'app-planner-review', imports: [FormsModule, UpperCasePipe], templateUrl: './planner-review.component.html', styleUrl: './planner-review.component.scss' })
export class PlannerReviewComponent {
  @Input({ required: true }) runId: string | undefined;
  @Input({ required: true }) sourceType!: string;
  @Input({ required: true }) testLayerCount!: number;
  @Input({ required: true }) summary!: string;
  @Input({ required: true }) criteria!: string;
  @Input({ required: true }) decision!: 'awaiting_approval' | 'approved' | 'rejected';
  @Output() summaryChange = new EventEmitter<string>();
  @Output() criteriaChange = new EventEmitter<string>();
  @Output() save = new EventEmitter<void>();
  @Output() approve = new EventEmitter<void>();
  @Output() reject = new EventEmitter<void>();
}
