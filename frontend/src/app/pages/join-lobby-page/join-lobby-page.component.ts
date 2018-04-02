import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LobbyService } from '../../providers';

@Component({
    selector: 'join-lobby-page',
    templateUrl: './join-lobby-page.component.html',
    styleUrls: ['./join-lobby-page.component.scss']
})
export class JoinLobbyPageComponent implements OnInit {

    lobbyId: string;
    form: any;
    formError: any;

    constructor(
        private router: Router,
        private lobbyService: LobbyService
    ) { }

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

}
