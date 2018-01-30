import { Injectable } from '@angular/core';
import { AsyncLocalStorageModule } from 'angular-async-local-storage';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {

  constructor(protected localStorage: AsyncLocalStorageModule, private router: Router) { }

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

  getCredentials(): Observable<{}> {
    return this.localStorage.getItem('user');
  }

}
