import { Routes } from '@angular/router';
import { TicketsComponent } from './tickets.component';
import { TicketComponent } from 'app/modules/component/table/ticket/ticket.component';

export default [
    {
        path: '',
        component: TicketsComponent,
    },
] as Routes;
