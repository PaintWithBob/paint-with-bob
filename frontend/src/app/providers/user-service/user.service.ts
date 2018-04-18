import { Injectable } from '@angular/core';
import { AsyncLocalStorage } from 'angular-async-local-storage';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth-service/auth.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

@Injectable()
export class UserService {

    constructor(
        protected localStorage: AsyncLocalStorage,
        private router: Router,
        private http: HttpClient,
        private authService: AuthService
    ) { }

    getUser(): Observable<any> {
        let httpOptions = { headers: new HttpHeaders() };
        return Observable.create(observer => {
            return this.authService.getToken().subscribe(token => {
                httpOptions.headers = new HttpHeaders({
                    'Authorization': token
                });
                return this.http.get(`${environment.apiUrl}/users/myUser`, httpOptions).subscribe(response => {
                    observer.next(response);
                    return observer.complete();
                }, error => {
                    observer.error(error);
                    return observer.complete();
                });
            }, error => {
                observer.error(error);
                return observer.complete();
            });
        });
    }

    // Edit account information
    editAccountInfo(userId: any, data: any): Observable<{}> {
        let httpOptions = { headers: new HttpHeaders() };
        return Observable.create(observer => {
            return this.authService.getToken().subscribe(token => {
                httpOptions.headers = new HttpHeaders({
                    'Authorization': token
                });
                return this.http.put(`${environment.apiUrl}/users/${userId}`, data, httpOptions).subscribe(response => {
                    observer.next(response);
                    return observer.complete();
                }, error => {
                    observer.error(error);
                    return observer.complete();
                });
            }, error => {
                observer.error(error);
                return observer.complete();
            });
        });
    }

    // Edit account information
    deleteAccount(userId: any): Observable<{}> {
        let httpOptions = { headers: new HttpHeaders() };
        return Observable.create(observer => {
            return this.authService.getToken().subscribe(token => {
                httpOptions.headers = new HttpHeaders({
                    'Authorization': token
                });
                return this.http.delete(`${environment.apiUrl}/users/${userId}`, httpOptions).subscribe(response => {
                    observer.next(response);
                    return observer.complete();
                }, error => {
                    observer.error(error);
                    return observer.complete();
                });
            }, error => {
                observer.error(error);
                return observer.complete();
            });
        });
    }

    // Save user's painting to database
    savePainting(painting: any): Observable<any> {
        let httpOptions = { headers: new HttpHeaders() };
        return new Observable(observer => {
            return this.authService.getToken().subscribe(token => {
                httpOptions.headers = new HttpHeaders({
                    'Authorization': token
                });
                return this.http.post(`${environment.apiUrl}/users/save-painting`, {painting: painting}, httpOptions).subscribe(response => {
                    observer.next(response);
                    return observer.complete();
                }, error => {
                    observer.error(error);
                    return observer.complete();
                });
            });
        });
    }

}
