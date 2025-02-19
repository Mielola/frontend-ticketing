import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { FinanceComponent } from 'app/modules/admin/dashboards/finance/finance.component';
import { FinanceService } from 'app/modules/admin/dashboards/finance/finance.service';
import { BlockLinkComponent } from './block-link.component';

export default [
    {
        path: '',
        component: BlockLinkComponent,
    },
] as Routes;
