import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IntakeModel } from '../../models/ui.models';
import { SourceType } from '../../services/test-run.service';

@Component({ selector: 'app-source-intake', imports: [FormsModule], templateUrl: './source-intake.component.html', styleUrl: './source-intake.component.scss' })
export class SourceIntakeComponent {
  @Input({ required: true }) model!: IntakeModel;
  @Input() submitted = false;
  readonly sourceTypes: { id: SourceType; label: string; description: string }[] = [
    { id: 'jira', label: 'Jira story', description: 'Pull acceptance criteria and context from a ticket.' },
    { id: 'document', label: 'Requirement doc', description: 'Paste or reference a product requirement.' },
    { id: 'github', label: 'GitHub change', description: 'Inspect a pull request or commit directly.' }
  ];
  selectSource(sourceType: SourceType): void { this.model.sourceType = sourceType; this.model.sourceValue = ''; this.model.documentFileName = ''; }
  handleDocumentFile(event: Event): void { const input = event.target as HTMLInputElement; this.model.documentFileName = input.files?.[0]?.name ?? ''; this.model.sourceValue = this.model.documentFileName; }
}
