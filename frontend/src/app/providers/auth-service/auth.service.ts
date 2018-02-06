import { Injectable, EventEmitter } from '@angular/core';
import { AsyncLocalStorage } from 'angular-async-local-storage';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { environment } from '../../../environments/environment';

import { Observable } from 'rxjs';

@Injectable()
export class AuthService {

  public userLoggedOut: EventEmitter<any>;
  public userLoggedIn: EventEmitter<any>;

  constructor(
    protected localStorage: AsyncLocalStorage,
    private router: Router,
    private http: Http
  ) {
    this.userLoggedOut = new EventEmitter();
    this.userLoggedIn = new EventEmitter();
  }

  // Sets the logged in user in local storage.
  setLoggedInUser(user: any): Observable<any> {
    return Observable.create(observer => {
      return this.localStorage.setItem('brUser', user).subscribe(response => {
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
        const hash = response._body.hash;
        return this.setLoggedInUser(hash).subscribe(response => {
          this.userLoggedIn.emit();
          return observer.next(hash);
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
      return this.http.post(`${environment.apiUrl}/users/login`, credentials).subscribe((response: any) => {
        return this.setLoggedInUser(JSON.parse(response._body).token).subscribe(response => {
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

  // Requests the user from local storage.
  getToken(): Observable<any> {
    return this.localStorage.getItem('brUser');
  }

}
