import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { ProjectComponent } from 'app/modules/admin/dashboards/home/home.component';
import { ProjectService } from 'app/modules/admin/dashboards/home/home.service';

export default [
    {
        path: '',
        component: ProjectComponent,
        resolve: {
            data: () => inject(ProjectService).getData(),
        },
    },
] as Routes;
