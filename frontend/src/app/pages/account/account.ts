import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../providers/auth-service/auth.service';

@Component({
	selector: 'page-account',
	templateUrl: 'account.html',
})
export class AccountPage implements OnInit {

	user: any;
	
	constructor(private authService: AuthService) { }
	
	ngOnInit() {
		this.authService.getUser().subscribe(user => {
			this.user = JSON.parse(user._body);
		}, error => {
			console.error(error);
		});
	}
	
}
