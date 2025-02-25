import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { CanDeactivateGuard } from 'app/core/auth/guards/can-deactive.guard';

export default [
    {
        path: '',
        component: ProfileComponent,
        canDeactivate: [CanDeactivateGuard] 
    },
] as Routes;
