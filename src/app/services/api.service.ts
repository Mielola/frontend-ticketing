import { Injectable, inject } from '@angular/core';
import axios from 'axios';
import { environment } from 'environments/environments.dev';
import { FuseLoadingService } from '@fuse/services/loading';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = environment.apiUrl;
    private _loadingService = inject(FuseLoadingService);

    private getHeaders() {
        return {
            headers: {
                'Authorization': `${localStorage.getItem('accessToken') || ''}`,
                'Content-Type': 'application/json'
            }
        };
    }

    async get(endPoint: string) {
        this._loadingService.show(); // Tampilkan loading bar
        try {
            const response = await axios.get(this.apiUrl + endPoint, this.getHeaders());
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        } finally {
            this._loadingService.hide()
        }
    }

    async post(endPoint: string, data: any) {
        this._loadingService.show(); // Tampilkan loading bar
        try {
            const response = await axios.post(this.apiUrl + endPoint, data, this.getHeaders());
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: error, status: error.response?.status };
        } finally {
            this._loadingService.hide()
        }
    }
}
