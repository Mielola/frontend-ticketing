import { Injectable } from '@angular/core';
import { environment } from 'environments/environments';
import axios from 'axios';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private apiUrl = environment.apiUrl;
    private _usersSubject = new BehaviorSubject<any>({})
    user$ = this._usersSubject.asObservable()

    constructor() { }

    Update(users: any) {
        this._usersSubject.next(users)
    }
}
