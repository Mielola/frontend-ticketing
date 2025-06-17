import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { ApiService } from 'app/services/api.service';
import axios from 'axios';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, from, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TicketTableService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    _datas = signal<any[]>([]);
    isLoading = signal<boolean>(true)
    isNotFound = signal<boolean>(false)

    constructor(
        private _apiService: ApiService,
        private _toastService: ToastrService,
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

    public checkTickets(): Observable<any> {
        return from(this._apiService.get("api/V1/check-tickets-deadline")).pipe(
            tap((response: any) => {
                console.log(response)
            })
        );
    }

    fetchDataByDate(startDate: string, endDate: string) {
        this.isLoading.set(true)
        this._apiService.get(`api/V1/tickets-date?start_date=${startDate}&end_date=${endDate}`)
            .then(response => {
                this.isLoading.set(false)
                this.isNotFound.set(false)
                this._datas.set(response.data);

                if (response.data === null) {
                    this.isNotFound.set(true)
                    return
                } else if (response.data.length == 0) {
                    this.isNotFound.set(true)
                    return
                }
            }).catch(error => {
                this.isLoading.set(false);
                this.isNotFound.set(true)
                this._toastService.error("Failed to fetch data", "Error")
            })

    }

    async fetchData() {
        this.isLoading.set(true)
        this._apiService.get("api/V1/tickets")
            .then(response => {
                this.isLoading.set(false)
                this.isNotFound.set(false)
                this._datas.set(response.data);

                if (response.data === null) {
                    this.isNotFound.set(true)
                    return
                } else if (response.data.length == 0) {
                    this.isNotFound.set(true)
                    return
                }
            }).catch(error => {
                this.isLoading.set(false);
                this.isNotFound.set(true)
                this._toastService.error("Failed to fetch data", "Error")
            })
    }
}