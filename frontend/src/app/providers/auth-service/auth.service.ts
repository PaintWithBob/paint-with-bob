import { Injectable } from '@angular/core';
import { AsyncLocalStorage } from 'angular-async-local-storage';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Http } from '@angular/http';

@Injectable()
export class AuthService {

  constructor(
    protected localStorage: AsyncLocalStorage,
    private router: Router,
    private http: Http
  ) { }

  // Sets the logged in user in local storage.
  setLoggedInUser(credentials: any) {
    return this.localStorage.setItem('brUser', credentials);
  }

  login(credentials: any) {
    this.setLoggedInUser(credentials).subscribe((credentials) => {
      console.log(credentials);
      this.router.navigate(['/account']);
    })
  }

  register(form: any): Observable<any> {
    return this.http.post('https://addo.serveo.net', form);
  }

  getCredentials(): Observable<any> {
    return this.localStorage.getItem('brUser');
  }

}
