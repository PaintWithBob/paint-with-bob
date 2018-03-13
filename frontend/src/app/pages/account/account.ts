import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, LobbyService } from '../../providers';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateLobbyPopupComponent } from '../../components/create-lobby-popup/create-lobby-popup.component';
import { EditAccountPopupComponent } from '../../components/edit-account-popup/edit-account-popup.component';
import { forkJoin } from "rxjs/observable/forkJoin";

@Component({
	selector: 'page-account',
	templateUrl: 'account.html',
})
export class AccountPage implements OnInit {

    token: any;
    user: any;
    createLobbyError: any;

	constructor(
        private authService: AuthService,
        private lobbyService: LobbyService,
        private router: Router,
        private modal: NgbModal
    ) { }

	ngOnInit() {
        forkJoin([
            this.authService.getUser(),
            this.authService.getToken()
        ]).subscribe((responses) => {
            // Success
            this.user = responses[0];
            this.token = responses[1];
            console.log(responses);
        }, (error) => {
            // Error
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

    editInfo() {
        const modalRef = this.modal.open(EditAccountPopupComponent, { windowClass: 'create-lobby' });
        modalRef.componentInstance.user = this.user;
        modalRef.result.then((result) => {
            if(result && !result.success) {
                this.createLobbyError = 'Error editing user';
            }
        }, (reason) => {

        });
    }


		//experimental code TODO: Add relevant info so it doesn't crash everything
		deleteUser(){
				const modalRef = this.modal.open(DeleteAccountPopupComponent, {windowClass: 'create-lobby'});
				modalRef.componentInstance.user = this.user;
				//is this setting the modal's user to current one in use?


				//think this is josh's error management code. Will change if proven wrong.
				modalRef.result.then((result) => {
            if(result && !result.success) {
                this.createLobbyError = 'Error deleting user';
            }
        }, (reason) => {

        });

		}



}
