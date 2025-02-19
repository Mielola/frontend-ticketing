import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { FinanceComponent } from 'app/modules/admin/dashboards/finance/finance.component';
import { FinanceService } from 'app/modules/admin/dashboards/finance/finance.service';
import { RoleManagementComponent } from './role-management.component';

export default [
    {
        path: '',
        component: RoleManagementComponent,
    },
    {
        path: 'add-role',
        loadChildren: () => import('app/modules/admin/dashboards/role-management/form-add/form-add.routes')
    },
    {
        path: 'edit-role/:name',
        loadChildren: () => import('app/modules/admin/dashboards/role-management/form-edit/form-edit.routes')
    }
] as Routes;
