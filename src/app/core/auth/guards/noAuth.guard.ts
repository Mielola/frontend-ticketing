import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/services/userService/user.service';
import { of, switchMap } from 'rxjs';

export const NoAuthGuard: CanActivateFn | CanActivateChildFn = (
    route,
    state
) => {
    const router: Router = inject(Router);
    const user: UserService = inject(UserService)

    // Check the authentication status
    return inject(AuthService)
        .check()
        .pipe(
            switchMap((authenticated) => {
                // If the user is authenticated...
                if (authenticated) {
                    return of(router.parseUrl(''));
                }

                // Allow the access
                return of(true);
            })
        );
};
