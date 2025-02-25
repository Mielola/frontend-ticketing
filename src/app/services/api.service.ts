// generate voucher service
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'environments/environments.dev';


@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = environment.apiUrl;
    private options = {
        headers: {
            'Authorization': `${localStorage.getItem('accessToken') || ''}`,
            'Content-Type': 'application/json'
        }
    };


    async get(endPoint: string) {
        return await axios.get(this.apiUrl + endPoint, this.options).then(
            async response => {
                return await response.data;
            }
        ).catch(async error => {
            console.error(error);
        });
    }


    async post(endPoint: string, data: any) {
        try {
            const response = await axios.post(this.apiUrl + endPoint, data, this.options);
            return { data: response.data, status: response.status };
        } catch (error) {
            return { data: null, status: error.response.status};
        }
    }

}

