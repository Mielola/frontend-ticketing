import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { ExportComponent } from './export.component';
import { HistoryTicketComponent } from './history-ticket/history-ticket.component';
import { ExportHistoryService } from 'app/modules/component/table/export-history/export-history.service';

export default [
    {
        path: '',
        component: ExportComponent,
    },
    {
        path: ':history-type',
        component: HistoryTicketComponent,
        resolve: {
            data: (route) => inject(ExportHistoryService).fetchData(route.paramMap.get('history-type'))
        }
    }
] as Routes;
