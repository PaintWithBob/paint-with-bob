import { Injectable, EventEmitter } from '@angular/core';
import { AsyncLocalStorage } from 'angular-async-local-storage';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { environment } from '../../../environments/environment';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {

    public userLoggedOut: EventEmitter<any>;
    public userLoggedIn: EventEmitter<any>;
    public userRegistered: EventEmitter<any>;

    constructor(
        protected localStorage: AsyncLocalStorage,
        private router: Router,
        private http: Http
    ) {
        this.userLoggedOut = new EventEmitter();
        this.userLoggedIn = new EventEmitter();
        this.userRegistered = new EventEmitter();
    }

    // Sets the logged in user in local storage.
    setLoggedInUser(user: any): Observable<any> {
        return Observable.create(observer => {
            return this.localStorage.setItem('brUser', {
                token: user.token,
                user: user.user
            }).subscribe(response => {
                return observer.next(response);
            }, () => {
                return observer.error('Error storing token');
            });
        });
    }

    // Register route for user.
    register(form: any): Observable<any> {
        return Observable.create(observer => {
            return this.http.post(`${environment.apiUrl}/users/join`, form).subscribe((response: any) => {
                return this.setLoggedInUser(JSON.parse(response._body).token).subscribe(() => {
                    this.userLoggedIn.emit();
                    this.userRegistered.emit();
                    return observer.next("Successfully created account and logged in");
                }, error => {
                    return observer.error(error);
                });
            }, error => {
                return observer.error(error);
            });
        });
    }

    // Logs user in and sets local storage key for future use.
    login(credentials: any): Observable<any> {
        return Observable.create(observer => {
            return this.http.post(`${environment.apiUrl}/users/login`, credentials)
            .map(response => response.json()).subscribe((response: any) => {
                return this.setLoggedInUser(response).subscribe(() => {
                    this.userLoggedIn.emit();
                    observer.next("Successfully logged in");
                    return this.router.navigate(['/account']);
                }, error => {
                    return observer.error(error);
                });
            }, error => {
                return observer.error(error);
            });
        });
    }

    // Logs user out by destroying local storage key and returns observable to be subscribe to.
    logout(): Observable<any> {
        return Observable.create(observer => {
            return this.localStorage.removeItem('brUser').subscribe(() => {
                this.userLoggedOut.emit();
                observer.next("Successfully logged out");
                return this.router.navigate(['/login']);
            }, error => {
                return observer.error(error);
            });
        });
    }

    // Requests the token from local storage.
    getToken(): Observable<any> {
        return new Observable((observer) => {
            this.localStorage.getItem('brUser').subscribe((response) => {
                return observer.next(response.token);
            }, () => {
                return observer.error('Could not get token');
            });
        });
    }

    // Requests the token from local storage.
    getUser(): Observable<any> {
        return new Observable((observer) => {
            this.localStorage.getItem('brUser').subscribe((response) => {
                return observer.next(response.user);
            }, () => {
                return observer.error('Could not get token');
            });
        });
    }
}
