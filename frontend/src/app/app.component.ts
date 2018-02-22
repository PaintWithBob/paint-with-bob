import { Component } from '@angular/core';
import { AuthService } from './providers/auth-service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  newUserRegistered: any;

  constructor(private authService: AuthService) {
    authService.userRegistered.subscribe(user => {
      this.newUserRegistered = "Account successfully created";
      setTimeout(() => {
        this.newUserRegistered = null;
      }, 5000);
    })
  }

}
