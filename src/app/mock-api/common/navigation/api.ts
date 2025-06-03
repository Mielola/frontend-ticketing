import { Injectable } from '@angular/core';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import {
    compactNavigation,
    defaultNavigation,
    futuristicNavigation,
    horizontalNavigation,
} from 'app/mock-api/common/navigation/data';
import { cloneDeep } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class NavigationMockApi {
    private readonly _compactNavigation: FuseNavigationItem[] =
        compactNavigation;
    private readonly _defaultNavigation: FuseNavigationItem[] =
        defaultNavigation;
    private readonly _futuristicNavigation: FuseNavigationItem[] =
        futuristicNavigation;
    private readonly _horizontalNavigation: FuseNavigationItem[] =
        horizontalNavigation;
    userRole = localStorage.getItem('userRole') || 'pegawai'; // sementara

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService) {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void {

        function filterNavigationByRole(navigation: FuseNavigationItem[], role: string): FuseNavigationItem[] {
            return navigation
                .filter(item => !item.roles || item.roles.includes(role))
                .map(item => ({
                    ...item,
                    children: item.children
                        ? item.children.filter(child => !child.roles || child.roles.includes(role))
                        : undefined,
                }));
        }

        // -----------------------------------------------------------------------------------------------------
        // @ Navigation - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService.onGet('api/common/navigation').reply(() => {
            const userRole = localStorage.getItem('userRole') || 'pegawai';

            // Isi children seperti biasa
            this._compactNavigation.forEach((compactNavItem) => {
                this._defaultNavigation.forEach((defaultNavItem) => {
                    if (defaultNavItem.id === compactNavItem.id) {
                        compactNavItem.children = cloneDeep(defaultNavItem.children);
                    }
                });
            });

            this._futuristicNavigation.forEach((futuristicNavItem) => {
                this._defaultNavigation.forEach((defaultNavItem) => {
                    if (defaultNavItem.id === futuristicNavItem.id) {
                        futuristicNavItem.children = cloneDeep(defaultNavItem.children);
                    }
                });
            });

            this._horizontalNavigation.forEach((horizontalNavItem) => {
                this._defaultNavigation.forEach((defaultNavItem) => {
                    if (defaultNavItem.id === horizontalNavItem.id) {
                        horizontalNavItem.children = cloneDeep(defaultNavItem.children);
                    }
                });
            });

            // ✅ Filter berdasarkan role
            const compactFiltered = filterNavigationByRole(this._compactNavigation, userRole);
            const defaultFiltered = filterNavigationByRole(this._defaultNavigation, userRole);
            const futuristicFiltered = filterNavigationByRole(this._futuristicNavigation, userRole);
            const horizontalFiltered = filterNavigationByRole(this._horizontalNavigation, userRole);

            return [
                200,
                {
                    compact: cloneDeep(compactFiltered),
                    default: cloneDeep(defaultFiltered),
                    futuristic: cloneDeep(futuristicFiltered),
                    horizontal: cloneDeep(horizontalFiltered),
                },
            ];
        });

    }
}
