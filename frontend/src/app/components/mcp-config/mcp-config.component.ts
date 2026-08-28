import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { McpServerModel } from '../../models/ui.models';

@Component({ selector: 'app-mcp-config', imports: [FormsModule], templateUrl: './mcp-config.component.html', styleUrl: './mcp-config.component.scss' })
export class McpConfigComponent {
  @Input({ required: true }) servers!: McpServerModel[];
  @Output() startRequested = new EventEmitter<void>();
  get selectedServers(): McpServerModel[] { return this.servers.filter((server) => server.selected); }
  toggle(server: McpServerModel): void { server.selected = !server.selected; server.started = false; }
  start(): void { this.startRequested.emit(); }
}
