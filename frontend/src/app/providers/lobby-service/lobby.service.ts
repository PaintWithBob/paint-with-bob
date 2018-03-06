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

    constructor(
        private http: Http,
        private authService: AuthService
    ) { }

    // Used to send message to room
    sendMessageToRoom(data: any) {
        this.socket.emit('message-sent', data);
    }

    // Creates lobby with user token.
    createLobby(form: any): Observable<{}> {
        return Observable.create(observer => {
            return this.authService.getToken().subscribe(token => {
                form.token = token;
                return this.http.post(`${environment.apiUrl}/lobby/create`, form)
                .map(response => response.json()).subscribe(response => {
                    observer.next(response);
                    return observer.complete();
                }, error => {
                    observer.error(error);
                    return observer.complete();
                });
            }, error => {
                observer.error(error);
                return observer.complete();
            });
        });
    }

}
