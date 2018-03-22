import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, UserService, LobbyService } from '../../providers';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateLobbyPopupComponent } from '../../components/create-lobby-popup/create-lobby-popup.component';
import { EditAccountPopupComponent } from '../../components/edit-account-popup/edit-account-popup.component';
import { DeleteAccountPopupComponent } from '../../components/delete-account-popup/delete-account-popup.component';
import { forkJoin } from "rxjs/observable/forkJoin";

@Component({
	selector: 'page-account',
	templateUrl: 'account.html',
})
export class AccountPage implements OnInit {

    token: any;
    user: any;
    createLobbyError: any;
    editInfoError: any;
    deleteUserSuccess: any;
    deleteUserError: any;
    accountUpdateSuccess: any;

	constructor(
        private authService: AuthService,
        private userService: UserService,
        private lobbyService: LobbyService,
        private router: Router,
        private modal: NgbModal
    ) { }

	ngOnInit() {
        this.authService.getToken().subscribe(token => {
            this.token = token;
            this.userService.getUser().subscribe(user => {
                this.user = user;
            }, error => {
                console.error(error);
            });
        }, error => { });
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
                this.editInfoError = 'Error editing user';
            } else if(result && result.data) {
                this.user = result.data;
                this.accountUpdateSuccess = "Successfully updated account.";
                setTimeout(() => {
                    this.accountUpdateSuccess = null;
                }, 5000);
            }
        }, (reason) => {

        });
    }


    //experimental code TODO: Add relevant info so it doesn't crash everything
    deleteUser() {
        const modalRef = this.modal.open(DeleteAccountPopupComponent, {windowClass: 'delete-account'});
        modalRef.componentInstance.userId = this.user._id;
        modalRef.result.then((result) => {
            if(result && result.success) {
                this.authService.logout().subscribe(() => {});
            } else if(result && result.error) {
                this.deleteUserError = 'Error deleting user';
            }
        }, (reason) => {

        });

    }



}
