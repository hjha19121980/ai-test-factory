import { Routes } from '@angular/router';
import { AgentRosterPageComponent } from './components/agent-roster-page/agent-roster-page.component';
import { NewRunPageComponent } from './components/new-run-page/new-run-page.component';
import { RunHistoryPageComponent } from './components/run-history-page/run-history-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'new-run', pathMatch: 'full' },
  { path: 'new-run', component: NewRunPageComponent },
  { path: 'run-history', component: RunHistoryPageComponent },
  { path: 'agent-roster', component: AgentRosterPageComponent }
];
