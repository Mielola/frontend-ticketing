import { Injectable, signal } from '@angular/core';
import { ApiService } from 'app/services/api.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class ShiftService {

    shiftSchedule = signal<any[]>([])
    dateCallendar = signal<string>("")
    shiftUserId = signal<number>(0)
    detailUserShift = signal<any>({})

    constructor(
        private _apiService: ApiService,
        private _toast: ToastrService,
    ) { }

    async fetchData() {
        try {
            const get = await this._apiService.get("api/V1/shifts-users")
            this.shiftSchedule.set(get)
        } catch (error) {
            this._toast.error("Error Fetch Data", "Error")
            throw error
        }
    }

    async fetchById(id: number) {
        try {
            const get = await this._apiService.get(`api/V1/shifts/${id}`)
            this.detailUserShift.set(get)
        } catch (error) {
            this._toast.error("Error Fetch Data", "Error")
            throw error
        }
    }

}