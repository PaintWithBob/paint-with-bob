import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'lobby-popup',
    templateUrl: './lobby-popup.component.html',
    styleUrls: ['./lobby-popup.component.scss']
})
export class LobbyPopupComponent implements OnInit {

    @Input() title: any;
    @Input() body: any;
    @Input() buttons: any;
    @Input() cssClass: any;

    constructor(
        private activeModal: NgbActiveModal
    ) {
        if(!this.cssClass) {
            this.cssClass = "";
        }
    }

    ngOnInit() {}

    close() {
        this.activeModal.close("Closed modal");
    }

    buttonClick(button: any) {
        this.activeModal.close({newRoom: button.newRoom});
    }

}
