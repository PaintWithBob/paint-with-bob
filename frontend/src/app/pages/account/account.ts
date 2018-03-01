import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, LobbyService } from '../../providers';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateLobbyPopupComponent } from '../../components/create-lobby-popup/create-lobby-popup.component';

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
        private router: Router,
        private modal: NgbModal
    ) { }

	ngOnInit() {
		this.authService.getToken().subscribe(token => {
			this.token = token
		}, error => {
			console.error(error);
		});
    }

    createLobby() {
        const modalRef = this.modal.open(CreateLobbyPopupComponent, { windowClass: 'create-lobby' });
        modalRef.componentInstance.token = this.token;
        modalRef.result.then((result) => {
            if(result && !result.success) {
                this.createLobbyError = 'Error creating lobby';
            }
        }, (reason) => {

        });
    }

}
