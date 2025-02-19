import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const OTPGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const cookieService = inject(CookieService);

    const hasOTP = cookieService.check('otp');

    return hasOTP ? true : router.parseUrl('');
};
