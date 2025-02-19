import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {
    constructor(private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const userRole = localStorage.getItem('userRole');
        const allowedRoles = route.data['roles'] as Array<string>;

        if (!allowedRoles || allowedRoles.includes(userRole)) {
            return true;
        }

        // Redirect to 404 if not authorized
        return this.router.createUrlTree(['/404-not-found']);
    }
}