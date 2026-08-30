import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  navItems = [
    { label: 'New run', path: '/new-run', index: '01' },
    { label: 'Run history', path: '/run-history', index: '02' },
    { label: 'Agent roster', path: '/agent-roster', index: '03' }
  ];
}
