import { Component } from '@angular/core';

@Component({
  selector: 'app-agent-roster-page',
  standalone: true,
  template: `
    <section class="panel-empty-state">
      <h2>Agent roster</h2>
      <p>The configured agents and runtime capabilities will appear here once they are registered.</p>
    </section>
  `,
  styles: [
    ':host { display: block; width: 100%; }',
    '.panel-empty-state { padding-top: 42px; }',
    '.panel-empty-state h2 { margin: 0 0 12px; font-size: 30px; }',
    '.panel-empty-state p { margin: 0; color: #8f948f; line-height: 1.6; }'
  ]
})
export class AgentRosterPageComponent {}
