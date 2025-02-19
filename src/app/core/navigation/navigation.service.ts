import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { Navigation } from 'app/core/navigation/navigation.types';
import { Observable, ReplaySubject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NavigationService {
    private _httpClient = inject(HttpClient);
    private _navigation: ReplaySubject<Navigation> =
        new ReplaySubject<Navigation>(1);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for navigation
     */
    get navigation$(): Observable<Navigation> {
        return this._navigation.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    private filterByRole(navigation: FuseNavigationItem[]): FuseNavigationItem[] {
        const userRole = localStorage.getItem('userRole');

        return navigation.filter(item => {
            if (item.roles && !item.roles.includes(userRole)) {
                return false;
            }

            if (item.children) {
                item.children = this.filterByRole(item.children);
                return item.children.length > 0;
            }

            return true;
        });
    }

    private filterNavigationByRole(navigation: FuseNavigationItem[], role: string): FuseNavigationItem[] {
        return navigation.filter(item => {
            // Jika item memiliki property roles, cek apakah role user ada di dalamnya
            if (item.roles && !item.roles.includes(role)) {
                return false;
            }

            // Filter children recursively
            if (item.children) {
                item.children = this.filterNavigationByRole(item.children, role);
                // Jika setelah filtering children kosong, hide parent
                if (item.children.length === 0) {
                    return false;
                }
            }

            return true;
        });
    }

    /**
     * Get all navigation data
     */
    get(): Observable<Navigation> {
        return this._httpClient.get<Navigation>('api/common/navigation').pipe(
            tap((navigation) => {
                navigation.default = this.filterByRole(navigation.default);
                this._navigation.next(navigation);
            })
        );
    }
}
