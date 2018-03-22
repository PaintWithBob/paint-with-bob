import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

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
        private router: Router
    ) { }

    ngOnInit() {
        this.form = { lobbyId: '' };
    }

    joinLobby(form: NgForm) {
        if(form.valid) {
            this.router.navigate(['/lobby/', this.form.lobbyId]);
        }
    }

}
