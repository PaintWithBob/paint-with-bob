import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import * as io from "socket.io-client";

@Injectable()
export class LobbyService {

    socket: any = io(environment.apiUrl);

    constructor() { }

    // Used to send message to room
    sendMessageToRoom(data: any) {
        this.socket.emit('message-sent', data);
    }

}
