import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'environments/environments';

@Injectable({
    providedIn: 'root'
})
export class LinkServiceService {

    private apiUrl = environment.apiUrl;

    constructor() { }

    async getLinkBlock() {
        return await axios.get(this.apiUrl + `api-netpro/api/mikrotik/get-web-block`).then(
            async response => {
                return response.data;
            }).catch(async error => {
                return error;
            })
    }

    async postLink(form: any) {
        return await axios.post(this.apiUrl + `api-netpro/api/mikrotik/web-block`, form).then(
            async response => {
                return response.data;
            }).catch(
                async error => {
                    console.log(error)
                    return error;
                }
            )
    }
}
