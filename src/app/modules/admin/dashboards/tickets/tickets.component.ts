import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TempTicketsComponent } from 'app/modules/component/table/temp-tickets/temp-tickets.component';
import { TicketLogsComponent } from 'app/modules/component/table/ticket-logs/ticket-logs.component';
import { TicketComponent } from 'app/modules/component/table/ticket/ticket.component';

@Component({
  selector: 'app-tickets',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    TicketComponent,
    TicketLogsComponent,
    RouterLink,
    TempTicketsComponent
  ],
  templateUrl: './tickets.component.html',
})
export class TicketsComponent {

}
