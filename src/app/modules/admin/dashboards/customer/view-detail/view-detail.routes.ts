import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { FinanceComponent } from 'app/modules/admin/dashboards/finance/finance.component';
import { FinanceService } from 'app/modules/admin/dashboards/finance/finance.service';
import { ViewDetailComponent } from './view-detail.component';

export default [
    {
        path: '',
        component: ViewDetailComponent,
    },
] as Routes;
