import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { HomeComponent } from 'app/modules/admin/dashboards/home/home.component';
import { HomeService } from 'app/modules/admin/dashboards/home/home.service';
import { TicketLogsService } from 'app/modules/component/table/ticket-logs/ticket-logs.service';

export default [
    {
        path: '',
        component: HomeComponent,
        resolve: {
            datas: () => inject(HomeService).fetchData(),
            data: () => inject(HomeService).getData(),
            ticket: () => inject(TicketLogsService).fetchData()

        },
    },
] as Routes;
