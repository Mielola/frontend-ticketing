import { Routes } from '@angular/router';
import { TicketsComponent } from './tickets.component';
import { inject } from '@angular/core';
import { TicketLogsService } from 'app/modules/component/table/ticket-logs/ticket-logs.service';

export default [
    {
        path: '',
        component: TicketsComponent,
        resolve: {
            data: () => inject(TicketLogsService).fetchData(),
        },
    },
] as Routes;
