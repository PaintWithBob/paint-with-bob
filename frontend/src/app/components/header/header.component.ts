import { Component } from '@angular/core';
import { AuthService } from '../../providers/auth-service/auth.service';

@Component({
	selector: 'component-header',
	templateUrl: 'header.component.html',
	styleUrls: ['header.component.scss']
})
export class HeaderComponent {

    userLoggedIn: boolean;

    constructor(private authService: AuthService) {
		// Check if there is a user logged in and set boolean accordingly.
		this.authService.getToken().subscribe(token => {
			if(token) {
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

}