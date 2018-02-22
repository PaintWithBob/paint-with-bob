import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth-service/auth.service';
import * as io from "socket.io-client";

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

@Injectable()
export class LobbyService {

    socket: any = io(environment.apiUrl);

    constructor(private http: Http, private authService: AuthService) { }

    // Used to send message to room
    sendMessageToRoom(data: any) {
        this.socket.emit('message-sent', data);
    }

    // Creates lobby with user token.
    createLobby(): Observable<{}> {
        return Observable.create(observer => {
            return this.authService.getToken().subscribe(token => {
                return this.http.post(`${environment.apiUrl}/lobby/create`, { token: token })
                .map(response => response.json()).subscribe(response => {
                    return observer.next(response);
                }, error => {
                    return observer.error(error);
                });
            }, error => {
                return observer.error(error);
            });
        });
    }

}
