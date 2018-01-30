import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../providers/auth-service/auth.service';

@Component({
	selector: 'page-account',
	templateUrl: 'account.html',
})
export class AccountPage implements OnInit {

    constructor(private authService) { }

		ngOnInit() {

		}

}
