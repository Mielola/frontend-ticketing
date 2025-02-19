import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { FinanceComponent } from 'app/modules/admin/dashboards/finance/finance.component';
import { FinanceService } from 'app/modules/admin/dashboards/finance/finance.service';
import { BandwithProfileComponent } from './bandwith-profile.component';

export default [
    {
        path: '',
        component: BandwithProfileComponent,
    },
] as Routes;
