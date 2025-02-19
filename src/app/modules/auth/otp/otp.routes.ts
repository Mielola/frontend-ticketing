import { Routes } from '@angular/router';
import { AuthSignUpComponent } from 'app/modules/auth/sign-up/sign-up.component';
import { OtpComponent } from './otp.component';

export default [
    {
        path: '',
        component: OtpComponent,
    },
] as Routes;
