import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth-service/auth.service';
import * as io from "socket.io-client";

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

@Injectable()
export class LobbyService {

    socket: any = io(environment.apiUrl);

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    // Used to send message to room
    sendMessageToRoom(data: any) {
        this.socket.emit('message-sent', data);
    }

    // Creates lobby with user token.
    createLobby(form: any): Observable<{}> {
        let httpOptions = { headers: new HttpHeaders() };
        return Observable.create(observer => {
            return this.authService.getToken().subscribe(token => {
                httpOptions.headers = new HttpHeaders({
                    'Authorization': token
                });
                return this.http.post(`${environment.apiUrl}/lobby/create`, form, httpOptions)
                .subscribe(response => {
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

    // Joins a lobby with given ID.
    joinLobby(lobbyId: any): Observable<any> {
        return new Observable(observer => {
            observer.next(`Lobby join: ${lobbyId}`);
            return observer.complete();
        });
    }

    // Joins a random lobby.
    joinRandomLobby(): Observable<any> {
        return new Observable(observer => {
            observer.next(`Random Lobby Join`);
            return observer.complete();
        });
    }

}
