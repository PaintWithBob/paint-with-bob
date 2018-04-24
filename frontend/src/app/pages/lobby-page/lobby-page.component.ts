import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, Router, NavigationStart } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { LobbyPopupComponent } from '../../components/lobby-popup/lobby-popup.component';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../providers';
import { forkJoin } from "rxjs/observable/forkJoin";
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
    roomName: any;
    isPrivate: boolean;
    socket: any;
    okToJoin: boolean;
    numberOfUsers: number = 0;
    testString: string = '';
    users: any[];
    user: any;
    otherUsers: any[];
    token: any;
    closeResult: any;
    shareUrl: any;
    messages: any[] = [];

    constructor(
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private router: Router,
        private modalService: NgbModal,
        private location: Location
    ) {
        setInterval(() => {
            this.randQuote();
        }, 10000);
    }

    randQuote(){
        var quote = Math.floor(Math.random() * 4); //0-9
        switch(quote) {
            case 0:
            this.testString = "We're all here to relax and make new friends.";
            break;
            case 1:
            this.testString = "If you think your painting is bad, try thinking of it as a happy little accident instead.";
            break;
            case 2:
            this.testString = "Don't worry, nobody is here to judge you.";
            break;
            default:
            this.testString = "Your painting is looking rather lovely right now.";
        }
    }

    ngOnInit() {

        this.randQuote();

        this.shareUrl = window.location.href;

        // Disconnect from the socket when you leave the room.
        this.router.events.filter(event => event instanceof NavigationStart).subscribe((event:any) => {
            if(this.socket) {
              this.socket.disconnect();
            }
        });

        // Subscribe to router event and assign room id.
        // Initialize socket with roomId.
        this.activatedRoute.params.subscribe((params: Params) => {

            this.roomId = params['roomId'];

            forkJoin([
                this.authService.getUser(),
                this.authService.getToken()
            ]).subscribe((responses) => {
                // Success

                this.user = responses[0];
                this.token = responses[1];

                // Finally, connect to our socket
                // Connect to correct socket namespace. (emits connection event)
                this.socket = io(`${environment.apiUrl}/lobby/room/${this.roomId}`, {
                    query: {
                        token: this.token
                    }
                });
                this.setEventHandlersOnSocket();
            }, () => {
                // Error

                // Finally, connect to our socket
                // Connect to correct socket namespace. (emits connection event)
                this.socket = io(`${environment.apiUrl}/lobby/room/${this.roomId}`);
                this.setEventHandlersOnSocket();
            });
        });
    }

    ngOnDestroy() {
      if(this.socket) {
        this.socket.disconnect();
      }
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

        // If we are a guest, and we have no user, find ourselves
        if(!this.user) {
            data.room.usersInRoom.some((user) => {
                if(user.socketId === this.socket.id) {
                    this.user = user.user;
                    return true;
                }
                return false;
            });
        }

        this.numberOfUsers = data.room.usersInRoom.length;
        this.users = data.room.usersInRoom;
        this.roomName = data.room.roomName;
        this.isPrivate = data.room.isPrivate;
    }

    // Function called in ngOnInit
    private setEventHandlersOnSocket() {

        this.socket.on('connect', () => {
            this.okToJoin = true;
        });

        // Runs when the room status is updated (users enters, user leaves, etc.)
        this.socket.on('ROOM_UPDATE', data => {
            setTimeout(() => {
                if(data.reason === 'USER_JOINED') {
                    this.roomUpdate(data);
                    this.otherUsers = null;
                } else if(data.reason === 'USER_LEFT') {
                    this.roomUpdate(data);
                    this.otherUsers = null;
                }
            });
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

        this.socket.on('CHAT_MESSAGE', data => {
            this.messages.push(data);
            console.log(data);
        });
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
        if(this.otherUsers) {
            return this.otherUsers;
        } else {
            if(!this.user || !this.users || this.users.length <= 1) {
                this.otherUsers = [];
                return this.otherUsers;
            }

            const otherUsers = this.users.filter((user) => {
                if(user.user._id !== this.user._id) {
                    return true;
                }
                return false;
            });
            this.otherUsers = otherUsers;
            return this.otherUsers;
        }
    }

}
