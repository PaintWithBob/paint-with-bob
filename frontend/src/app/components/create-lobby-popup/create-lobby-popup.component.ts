import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LobbyService } from '../../providers/lobby-service/lobby.service';

@Component({
    selector: 'create-lobby-popup',
    templateUrl: './create-lobby-popup.component.html',
    styleUrls: ['./create-lobby-popup.component.scss']
})
export class CreateLobbyPopupComponent implements OnInit {

    lobbyForm: any = {};

    @Input() token;

    constructor(
        private router: Router,
        private activeModal: NgbActiveModal,
        private lobbyService: LobbyService
    ) { }

    ngOnInit() { }

    close() {
        this.activeModal.close();
    }

    submit(form: NgForm) {
        if(form.valid) {
            this.lobbyService.createLobby(this.lobbyForm).subscribe((response: any) => {
                if(response.roomId) {
                    this.router.navigate(['/lobby', response.roomId]);
                    this.activeModal.close({success: true, message: 'Creating Lobby', data: response });
                } else {
                    this.activeModal.close({success: false, message: 'Error creating lobby: no roomId received.'});
                }
            }, error => {
                console.error(error);
                this.activeModal.close({success: false, message: error.message});
            });
        }
    }

}
