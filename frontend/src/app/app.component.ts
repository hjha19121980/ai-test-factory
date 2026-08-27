import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type SourceType = 'jira' | 'document' | 'github';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly sourceTypes: { id: SourceType; label: string; description: string }[] = [
    { id: 'jira', label: 'Jira story', description: 'Pull acceptance criteria and context from a ticket.' },
    { id: 'document', label: 'Requirement doc', description: 'Paste or reference a product requirement.' },
    { id: 'github', label: 'GitHub change', description: 'Inspect a pull request or commit directly.' }
  ];

  sourceType: SourceType = 'jira';
  sourceValue = '';
  repository = '';
  branch = 'main';
  notes = '';
  isSubmitted = false;

  selectSource(sourceType: SourceType): void {
    this.sourceType = sourceType;
    this.isSubmitted = false;
  }

  submitToPlanner(): void {
    this.isSubmitted = true;
  }
}
