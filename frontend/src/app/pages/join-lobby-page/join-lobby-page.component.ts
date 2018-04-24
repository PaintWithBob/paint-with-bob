import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LobbyService } from '../../providers';
import { AuthService } from '../../providers/auth-service/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateLobbyPopupComponent } from '../../components/create-lobby-popup/create-lobby-popup.component';

@Component({
    selector: 'join-lobby-page',
    templateUrl: './join-lobby-page.component.html',
    styleUrls: ['./join-lobby-page.component.scss']
})
export class JoinLobbyPageComponent implements OnInit {

    token: any;
    userLoggedIn: boolean;
    lobbyId: string;
    form: any;
    formError: any;
    createLobbyError: any;

    constructor(
        private router: Router,
        private modal: NgbModal,
        private authService: AuthService,
        private lobbyService: LobbyService
    ) {

      //added auth service so we can only display "create private lobby" and all that jazz if the user is logged in

      this.authService.getToken().subscribe(token => {
          if (token) {
              this.userLoggedIn = true;
          } else {
              this.userLoggedIn = false;
          }
      }, () => {});
      // Subscribe to login event to change boolean when user logs in.
      this.authService.userLoggedIn.subscribe(() => {
          this.userLoggedIn = true;
      });
      // Subscribe to logout event to change boolean when user logs out.
      this.authService.userLoggedOut.subscribe(() => {
          this.userLoggedIn = false;
      });

     }

    ngOnInit() {
        this.form = { lobbyId: '' };
    }

    joinLobby(form: NgForm) {
        if(form.valid) {
            this.router.navigate(['/lobby/', this.form.lobbyId]);
        }
    }

    joinRandomLobby() {
        this.lobbyService.joinRandomLobby().subscribe(response => {
            this.router.navigate(['/lobby/', response.roomId]);
        }, error => {
            console.error(error);
        });
    }

    //Create modal for private lobby stuff
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
