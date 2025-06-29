
import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from 'app/services/api.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class HandoverService {
    private _apiService = inject(ApiService)
    private _toastService = inject(ToastrService)
    _data = signal<any[]>([]);

    isLoading = signal<boolean>(false);
    isNotFound = signal<boolean>(false);

    async fetchData() {
        this.isLoading.set(true)
        this._apiService.get("api/V1/notes")
            .then(async response => {
                this.isLoading.set(false)
                this.isNotFound.set(false)
                this._data.set(response.data)

                if (response.data === null) {
                    this.isNotFound.set(true)
                    return
                } else if (response.data.length == 0) {
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