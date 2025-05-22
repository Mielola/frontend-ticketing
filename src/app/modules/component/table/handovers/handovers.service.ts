import { Injectable, signal } from '@angular/core';
import { ApiService } from 'app/services/api.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class HandOversService {
    _data = signal<any[]>([]);
    isLoading = signal<boolean>(false);
    isNotFound = signal<boolean>(false);

    constructor(
        private _apiService: ApiService,
        private _toastService: ToastrService,
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */

    /**
     * Setter for data
     */
    Update(data: any) {
        this._data.set(data)
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */

    async fetchData() {
        this.isLoading.set(true)
        this._apiService.get("api/V1/tickets/handover")
            .then(async response => {
                this.isLoading.set(false)
                this.isNotFound.set(false)
                this._data.set(response.data)

                if (response.data === null) {
                    this.isNotFound.set(true)
                    return
                }
            }).catch(async error => {
                this.isLoading.set(false);
                this.isNotFound.set(true)
                this._toastService.error("Failed to fetch data", "Error")
            })
    }
}