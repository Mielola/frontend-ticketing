import { Injectable, signal } from '@angular/core';
import { ApiService } from 'app/services/api.service';
import { BehaviorSubject, from, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {

    private _datas: BehaviorSubject<any> = new BehaviorSubject(null);
    currentProducts = signal<string>(null)

    /**
     * Constructor
     */
    constructor(
        private _apiService: ApiService
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    get datas$(): Observable<any> {
        return this._datas.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */

}
