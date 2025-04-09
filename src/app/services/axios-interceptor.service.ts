import { Injectable, inject } from '@angular/core';
import axios from 'axios';
import { FuseLoadingService } from '@fuse/services/loading';

@Injectable({
    providedIn: 'root'
})
export class AxiosInterceptorService {
    private _loadingService = inject(FuseLoadingService);

    constructor() {
        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        axios.interceptors.request.use(
            (config) => {
                console.log('Axios Request Start'); // Debugging
                this._loadingService.show(); // Tampilkan loading bar
                return config;
            },
            (error) => {
                this._loadingService.hide();
                return Promise.reject(error);
            }
        );

        axios.interceptors.response.use(
            (response) => {
                console.log('Axios Request End'); // Debugging
                this._loadingService.hide(); // Sembunyikan loading bar setelah request selesai
                return response;
            },
            (error) => {
                this._loadingService.hide();
                return Promise.reject(error);
            }
        );
    }
}
