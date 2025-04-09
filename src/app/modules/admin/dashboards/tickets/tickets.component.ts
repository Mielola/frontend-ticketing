import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TicketLogsComponent } from 'app/modules/component/table/ticket-logs/ticket-logs.component';
import { TicketComponent } from 'app/modules/component/table/ticket/ticket.component';

@Component({
  selector: 'app-tickets',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TicketComponent, TicketLogsComponent],
  templateUrl: './tickets.component.html',
})
export class TicketsComponent {

}
