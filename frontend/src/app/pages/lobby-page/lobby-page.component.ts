import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, Router, NavigationStart } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { LobbyPopupComponent } from '../../components/lobby-popup/lobby-popup.component';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../providers';
import * as io from 'socket.io-client';
import 'rxjs/add/operator/filter';

export interface button {
    newRoom: boolean;
    text: string;
    link: string;
}

@Component({
    selector: 'app-lobby-page',
    templateUrl: './lobby-page.component.html',
    styleUrls: ['./lobby-page.component.scss']
})
export class LobbyPageComponent implements OnInit, OnDestroy {

    roomId: any;
    socket: any;
    okToJoin: boolean;
    numberOfUsers: number = 0;
    users: any[];
    user: any;
    closeResult: any;
    shareUrl: any;

    constructor(
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private router: Router,
        private modalService: NgbModal,
        private location: Location
    ) { }

    ngOnInit() {

        this.shareUrl = window.location.href;

        // Disconnect from the socket when you leave the room.
        this.router.events.filter(event => event instanceof NavigationStart).subscribe((event:any) => {
            this.socket.disconnect();
        });

        // Get our current user
        this.authService.getUser().subscribe((user) => {
          this.user = user;
        });

        // Subscribe to router event and assign room id.
        // Initialize socket with roomId.
        this.activatedRoute.params.subscribe((params: Params) => {
            this.roomId = params['roomId'];
            this.authService.getToken().subscribe(token => {

                // Connect to correct socket namespace. (emits connection event)
                this.socket = io(`${environment.apiUrl}/lobby/room/${this.roomId}`, { query: { token: token} });
                this.socket.on('connect', () => {
                    this.okToJoin = true;
                });

                // Runs when the room status is updated (users enters, user leaves, etc.)
                this.socket.on('ROOM_UPDATE', data => {
                    console.log('Room updated: ', data);
                    if(data.reason === 'USER_JOINED') {
                        this.roomUpdate(data);
                    } else if(data.reason === 'USER_LEFT') {
                        this.roomUpdate(data);
                    }
                });

                // Listen for user getting kicked.
                this.socket.on('KICK', data => {
                    if(data.reason === 'ROOM_FULL') {
                        console.log('KICK - ROOM_FULL: ', data);
                        this.roomUpdate(data);
                        this.openModal('Room Inactive','Looks like the room you are trying to connect to is no longer active.', [{newRoom: false, text: 'Back Home', link: '../'}, {newRoom: true, text: 'Find New Lobby', link: '../'}], 'error');
                    } else if(data.reason === 'ADMIN_KICK') {
                        console.log('KICK - ADMIN_KICK: ', data);
                        this.roomUpdate(data);
                        this.openModal('Room Inactive','Looks like the room you are trying to connect to is no longer active.', [{newRoom: false, text: 'Back Home', link: '../'}, {newRoom: true, text: 'Find New Lobby', link: '../'}], 'error');
                    } else if(data.reason === 'ROOM_DOES_NOT_EXIST') {
                        console.log("Room doesn't exist bro");
                        this.roomUpdate(data);
                    }
                });

                // Track any errors that occur with connection and redirect user out of room.
                this.socket.on('error', (error) => {
                    if(error === 'Invalid namespace') {
                        console.log("Invalid room");
                        this.openModal('Room Inactive','Looks like the room you are trying to connect to is no longer active.', [{newRoom: false, text: 'Back Home', link: '../'}, {newRoom: true, text: 'Find New Lobby', link: '../'}], 'error');
                    } else if (typeof console !== "undefined" && console !== null) {
                        console.error("Socket.io reported a generic error");
                        // Show a popup telling user that room does not exist
                        // For now, redirect back to homepage.
                        this.router.navigate(['../']);
                    }
                });
            });
        });
    }

    ngOnDestroy() {
        this.socket.disconnect();
    }

    // Opens modal and sets the input elements
    openModal(title: string, body: string, buttons: button[], cssClass?: any) {
        const modalRef = this.modalService.open(LobbyPopupComponent, { windowClass: cssClass });
        modalRef.componentInstance.title = title;
        modalRef.componentInstance.body = body;
        modalRef.componentInstance.buttons = buttons;
        modalRef.componentInstance.cssClass = cssClass;
        modalRef.result.then((result) => {
            if(result && result.newRoom) {
                console.log('Find new room');
            } else {
                this.router.navigate(['../']);
            }
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            this.router.navigate(['../']);
        });
    }

    // Whenever the room gets updated, run this method.
    roomUpdate(data: any) {
        this.numberOfUsers = data.room.usersInRoom.length;
        this.users = data.room.usersInRoom;
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return  `with: ${reason}`;
        }
    }

    // Function to return all other users in the room
    private getOtherUsersInLobby() {

      if(!this.users || this.users.length <= 1) {
        return [];
      }

      const otherUsers = this.users.filter((user) => {
        if(user.user._id !== this.user._id) {
          return true;
        }
        return false;
      });

      console.log(otherUsers);

      return otherUsers;
    }

}
