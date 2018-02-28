import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, LobbyService } from '../../providers';

@Component({
	selector: 'page-account',
	templateUrl: 'account.html',
})
export class AccountPage implements OnInit {

    token: any;
    createLobbyError: any;

	constructor(
        private authService: AuthService,
        private lobbyService: LobbyService,
        private router: Router
    ) { }

	ngOnInit() {
		this.authService.getToken().subscribe(token => {
			this.token = token
		}, error => {
			console.error(error);
		});
    }

    createLobby() {
        this.createLobbyError = null;
        this.lobbyService.createLobby().subscribe((response: any) => {
            if(response.roomId) {
                this.router.navigate(['/lobby', response.roomId]);
            } else {
                this.createLobbyError = 'Error creating lobby: not roomId received.';
            }
        }, error => {
            console.error(error);
            this.createLobbyError = error;
        });
    }

}
