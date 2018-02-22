import { Component } from '@angular/core';
import { AuthService } from '../../providers/auth-service/auth.service';

@Component({
    selector: 'component-footer',
    templateUrl: 'footer.component.html',
    styleUrls: ['footer.component.scss']
})
export class FooterComponent {

    userLoggedIn: boolean;

    constructor(private authService: AuthService) {
        // Check if there is a user logged in and set boolean accordingly.
        this.authService.getToken().subscribe(token => {
            if (token) {
                this.userLoggedIn = true;
            } else {
                this.userLoggedIn = false;
            }
        });
        // Subscribe to login event to change boolean when user logs in.
        this.authService.userLoggedIn.subscribe(() => {
            this.userLoggedIn = true;
        });
        // Subscribe to logout event to change boolean when user logs out.
        this.authService.userLoggedOut.subscribe(() => {
            this.userLoggedIn = false;
        });
    }

    logout() {
        this.authService.logout().subscribe(response => {
            console.log(response);
        }, error => {
            console.error(error);
        });
    }

}
