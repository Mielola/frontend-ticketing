import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'environments/environments';

@Injectable({
    providedIn: 'root'
})
export class OrderServiceService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    async getProduct() {

        return await axios.get(`${this.apiUrl}awh_pos/api/v1/products?service=2`, {
            headers: {
                'public-key': environment.apiKey
            }
        }).then(
            async response => {
                return response.data
            }).catch(
                async error => {
                    console.log(error)
                }
            )
    }
}


