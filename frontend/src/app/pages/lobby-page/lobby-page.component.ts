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
    roomOwner: any;
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
        var quote = Math.floor(Math.random() * 10); //0-9 quotes
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
            case 3:
            this.testString = "Lets get a little crazy.";
            break;
            case 4:
            this.testString = "Its ok if you don't want to paint along. Sometimes its nice to let your imagination run wild.";
            break;
            case 5:
            this.testString = "You can do it. We believe in you.";
            break;
            case 6:
            this.testString = "This is your world. Find freedom on the canvas.";
            break;
            case 7:
            this.testString = "The secret to doing anything is believing in yourself.";
            break;
            case 8:
            this.testString = "Mix it up. Draw a tree. Make it a desert. This is your painting.";
            break;
            case 9:
            this.testString = "Lets all have a great time together.";
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
              this.disconnectSocket();
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
        this.disconnectSocket();
      }
    }

    // Eat clicks on the landscape/portrait overlay
    overlayClick() {
      return;
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
        this.roomOwner = data.room.owner;
    }

    // Function called in ngOnInit
    private setEventHandlersOnSocket() {

        this.socket.on('connect', () => {
          this.okToJoin = true;
        });

        this.socket.on('connect_error', (error) => {
          this.defaultSocketError(error);
        });

        // Listen for when the socket disconnects from us
        this.socket.on('disconnect', () => {
          setTimeout(() => {
            if(this.socket) {
                console.log('This one');
              this.disconnectSocket();
              this.openModal('Room Disconnected','Looks like the room you are trying to connect to is no longer active.', [{newRoom: false, text: 'OK', link: '/'}], 'error');
            }
          }, 500);
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
                } else if(data.reason === 'USER_KICKED') {
                    this.roomUpdate(data);
                    this.otherUsers = null;
                }
            });
        });

        // Listen for user getting kicked.
        this.socket.on('KICK', data => {
            console.log('Kicked, Data:', data);
            if(data.reason === 'ROOM_FULL') {
                console.log('KICK - ROOM_FULL: ', data);
                this.roomUpdate(data);
                this.openModal('Room Full','Looks like the room you are trying to connect to is full.', [{newRoom: false, text: 'Back Home', link: '/'}], 'error');
                this.disconnectSocket();
            } else if(data.reason === 'ADMIN_KICK') {
                console.log('KICK - ADMIN_KICK: ', data);
                this.roomUpdate(data);
                this.openModal('Kicked From Room','Looks like you have been kicked out of the room by the admin.', [{newRoom: false, text: 'Back Home', link: '../'}, {newRoom: true, text: 'Find New Lobby', link: '../'}], 'error');
                this.disconnectSocket();
            } else if(data.reason === 'ROOM_DOES_NOT_EXIST') {
                console.log("Room doesn't exist bro");
                this.roomUpdate(data);
                this.disconnectSocket();
            }
        });

        // Track any errors that occur with connection and redirect user out of room.
        this.socket.on('error', (error) => {
            if(error === 'Invalid namespace') {
                console.log("Invalid room");
                this.openModal('Room Invalid','Looks like the room you are trying to connect to is no longer active.', [{newRoom: false, text: 'Back Home', link: '/'}], 'error');
                this.disconnectSocket();
            } else if (typeof console !== "undefined" && console !== null) {
                console.error("Socket.io reported a generic error");
                // Show a popup telling user that room does not exist
                // For now, redirect back to homepage.
                this.defaultSocketError(error);
            }
        });

        this.socket.on('CHAT_MESSAGE', data => {
            this.messages.push(data);
            // Need to reset the array for change detection
            // https://stackoverflow.com/questions/43223582/why-angular-2-ngonchanges-not-responding-to-input-array-push?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
            this.messages = this.messages.slice();
        });
    }

    private defaultSocketError(error) {
      // Just redirect back home, most likely on a bad refresh
      console.error(error);
      this.disconnectSocket();
      this.router.navigate(['/']);
    }

    private disconnectSocket() {
        console.log('asdfasdf', this.socket);
      if(this.socket) {
        this.socket.disconnect();
        this.socket = undefined;
      }
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
