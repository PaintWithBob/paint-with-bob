import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../providers/auth-service/auth.service';

@Component({
	selector: 'page-account',
	templateUrl: 'account.html',
})
export class AccountPage implements OnInit {

	token: any;
	
	constructor(private authService: AuthService) { }
	
	ngOnInit() {
		this.authService.getToken().subscribe(token => {
			this.token = token
		}, error => {
			console.error(error);
		});
	}
	
}
