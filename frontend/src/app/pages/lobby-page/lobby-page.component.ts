import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { environment } from '../../../environments/environment';
import * as io from 'socket.io-client';

@Component({
    selector: 'app-lobby-page',
    templateUrl: './lobby-page.component.html',
    styleUrls: ['./lobby-page.component.scss']
})
export class LobbyPageComponent implements OnInit {

    roomId: any;
    socket: any;

    constructor(
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit() {
        // Subscribe to router event and assign room id.
        // Initialize socket with roomId.
        this.activatedRoute.params.subscribe((params: Params) => {
            this.roomId = params['roomId'];
            // Connect to correct socket namespace. (emits connection event)
            this.socket = io(`${environment.apiUrl}/lobby/room/${this.roomId}`);
            // Listen for user disconnecting.
            this.socket.on('disconnected', data => {
                console.log(data);
            });
        });

    }

}
