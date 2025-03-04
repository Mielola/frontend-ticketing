import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from 'app/services/api.service';
import axios from 'axios';
import { BehaviorSubject, from, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TicketLogsService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    constructor(
        private _apiService: ApiService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */
    get data$(): Observable<any> {
        return this._data.asObservable();
    }

    /**
     * Setter for data
     */
    Update(data: any) {
        this._data.next(data)
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */

    public fetchData(): Observable<any> {
        return from(this._apiService.get("api/V1/tickets-logs")).pipe(
            tap((response: any) => {
                console.log(response)
                this._data.next(response);
            })
        );

    }
}