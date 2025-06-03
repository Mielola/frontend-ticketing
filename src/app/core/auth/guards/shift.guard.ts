import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from 'app/services/userService/user.service';
import { map, take } from 'rxjs/operators';

export const ShiftGuarrd: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const userService = inject(UserService);

    const isAdmin: boolean = localStorage.getItem("userRole") === 'admin';

    return userService.user$.pipe(
        take(1), // ambil 1x data saja
        map((users) => {
            const shiftStatus = users.shift_status === 'Active Shift';

            if (isAdmin || shiftStatus) {
                return true;
            } else {
                return router.parseUrl('/dashboards/tickets');
            }
        })
    );
};
