import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { FinanceComponent } from 'app/modules/admin/dashboards/finance/finance.component';
import { FinanceService } from 'app/modules/admin/dashboards/finance/finance.service';
import { CustomerComponent } from './customer.component';
import { HomeService } from '../home/home.service';
import { ViewDetailComponent } from './view-detail/view-detail.component';

export default [
    {
        path: '',
        component: CustomerComponent,
        resolve: {
            data: () => inject(HomeService).getData(),
        },
    },
    {
        path: 'view-detail/:name',
        loadChildren: () => import('app/modules/admin/dashboards/customer/view-detail/view-detail.routes')
    },
    {
        path: 'add-user',
        loadChildren: () => import('app/modules/admin/dashboards/customer/form-add/form-add.routes')
    },
    {
        path: 'edit-user/:name',
        loadChildren: () => import('app/modules/admin/dashboards/customer/form-edit/form-edit.routes')
    }
] as Routes;
