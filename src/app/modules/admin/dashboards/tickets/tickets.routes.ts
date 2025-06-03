import { Routes } from '@angular/router';
import { TicketsComponent } from './tickets.component';
import { inject } from '@angular/core';
import { TicketLogsService } from 'app/modules/component/table/ticket-logs/ticket-logs.service';
import { TicketTableService } from 'app/modules/component/table/ticket/ticket.service';
import { ShiftGuarrd } from 'app/core/auth/guards/shift.guard';

export default [
    {
        path: '',
        component: TicketsComponent,
        resolve: {
            check: () => inject(TicketTableService).checkTickets(),
            data: () => inject(TicketLogsService).fetchData(),
            ticket: () => inject(TicketTableService).fetchData()
        },
    },
    {
        path: 'add-tickets',
        canActivate: [ShiftGuarrd],
        loadChildren: () => import('app/modules/admin/dashboards/tickets/form-add-tickets/form-add-tickets.routes')
    },
    {
        path: ':trackingId',
        loadChildren: () => import('app/modules/admin/dashboards/tickets/detail-tickets/detail-tickets.routes')
    }
] as Routes;
