import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import * as io from 'socket.io-client';
import { AuthService } from '../../providers';

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

    constructor(
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
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
                        this.numberOfUsers = data.room.usersInRoom.length;
                    } else if(data.reason === 'USER_LEFT') {
                        this.numberOfUsers = data.room.usersInRoom.length;
                    }
                });

                // Listen for user getting kicked.
                this.socket.on('KICK', data => {
                    if(data.reason === 'ROOM_FULL') {
                        console.log('KICK - ROOM_FULL: ', data);
                        // Display a message to user, decrement user number, and redirect out of room.
                        this.numberOfUsers = data.room.usersInRoom.length;
                    } else if(data.reason === 'ADMIN_KICK') {
                        console.log('KICK - ADMIN_KICK: ', data);
                        // Display a message to user, decrement user number, and redirect out of room.
                        this.numberOfUsers = data.room.usersInRoom.length;
                    }
                });

                // Track any errors that occur with connection and redirect user out of room.
                this.socket.on('error', () => {
                    if (typeof console !== "undefined" && console !== null) {
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
}
