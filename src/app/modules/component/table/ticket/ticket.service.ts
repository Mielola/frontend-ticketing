import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { AnalyticsService } from 'app/modules/admin/dashboards/analytics/analytics.service';
import { ApiService } from 'app/services/api.service';
import { Sumarry } from 'app/types/summary';
import axios from 'axios';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, from, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TicketTableService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    _datas = signal<any[]>([]);
    sumarry = signal<Sumarry>(null)
    isLoading = signal<boolean>(true)
    isNotFound = signal<boolean>(false)

    constructor(
        private _apiService: ApiService,
        private _toastService: ToastrService,
        private _analyticsService: AnalyticsService,
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

    get currentProducts$(): string {
        return this._analyticsService.currentProducts();
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

    async fetchDataByPlaces(places_name: string) {
        this.isLoading.set(true)
        this._apiService.post(`api/V1/statistik/places`, {
            places_name: places_name
        })
            .then(response => {
                this.isLoading.set(false)
                this.isNotFound.set(false)
                this.sumarry.set(response.data.data.sumary);
                this._datas.set(response.data.data.tickets);

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

    async fetchDataByCategory(category_name: string) {
        this.isLoading.set(true)
        this._apiService.post(`api/V1/statistik/category`, {
            category_name: category_name
        })
            .then(response => {
                this.isLoading.set(false)
                this.isNotFound.set(false)
                this.sumarry.set(response.data.data.sumary);
                this._datas.set(response.data.data.tickets);

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

    async fetchDataByUsers(name: string) {
        this.isLoading.set(true)
        this._apiService.post(`api/V1/statistik/user`, {
            name: name,
            product_name: this.currentProducts$
        })
            .then(response => {
                this.isLoading.set(false)
                this.isNotFound.set(false)
                this.sumarry.set(response.data.data.sumary);
                this._datas.set(response.data.data.tickets);

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