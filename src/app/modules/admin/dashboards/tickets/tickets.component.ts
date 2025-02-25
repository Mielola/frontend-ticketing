import { Component } from '@angular/core';
import { TicketComponent } from 'app/modules/component/table/ticket/ticket.component';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [TicketComponent],
  templateUrl: './tickets.component.html',
})
export class TicketsComponent {

}
