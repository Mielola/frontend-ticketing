import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'environments/environments';

@Injectable({
    providedIn: 'root'
})
export class RoleService {
    private apiUrl = environment.apiUrl;

    constructor() { }


    async getProfile() {
        return await axios.get(this.apiUrl + `api-netpro/api/mikrotik/get-profile`).then(
            async response => {
                return response.data;
            }).catch(async error => {
                console.log(error)
            })
    }

    async getProfileByName(name: string) {
        return await axios.get(this.apiUrl + `api-netpro/api/mikrotik/get-profile/${name}`).then(
            async response => {
                return response.data;
            }).catch(async error => {
                console.log(error)
            })
    }

    async getProfilePagination(page: number) {
        return await axios.get(this.apiUrl + `api-netpro/api/mikrotik/get-profile-Pagi?page=${page}`).then(
            async response => {
                return response.data;
            }).catch(async error => {
                console.log(error)
            })
    }

    async updateProfile(name: string, form: any) {
        return await axios.post(this.apiUrl + `api-netpro/api/mikrotik/hotspot-profile/${name}`, form).then(
            async response => {
                return response.data;
            }).catch(async error => {
                console.log(error)
            })
    }


    async deleteProfile(profile_name: string) {
        return await axios.delete(`${this.apiUrl}api-netpro/api/mikrotik/delete-profile/${profile_name}`).then(
            async response => {
                return response.data;
            }).catch(async error => {
                console.log(error)
            })
    }

    async addProfile(form: any) {
        return await axios.post(`${this.apiUrl}api-netpro/api/mikrotik/set-profile`, form).then(
            async response => {
                return response.data;
            }).catch(async error => {
                console.log(error)
            })
    }

}
