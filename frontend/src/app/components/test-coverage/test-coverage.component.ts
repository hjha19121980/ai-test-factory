import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({ selector: 'app-test-coverage', imports: [FormsModule], templateUrl: './test-coverage.component.html', styleUrl: './test-coverage.component.scss' })
export class TestCoverageComponent {
  @Input({ required: true }) selectedTestTypes!: Set<string>;
  @Input() submitted = false;
  readonly testTypes = ['Unit', 'API', 'Integration', 'E2E / UI', 'Accessibility', 'Performance'];
  toggle(testType: string): void { if (this.selectedTestTypes.has(testType)) this.selectedTestTypes.delete(testType); else this.selectedTestTypes.add(testType); }
}
