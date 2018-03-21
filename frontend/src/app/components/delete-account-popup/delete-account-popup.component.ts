import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../providers';

@Component({
    selector: 'delete-account-popup',
    templateUrl: './delete-account-popup.component.html',
    styleUrls: ['./delete-account-popup.component.scss']
})
export class DeleteAccountPopupComponent implements OnInit {

    @Input() userId;

    constructor(
        private activeModal: NgbActiveModal,
        private userService: UserService
    ) {}

    ngOnInit() {}

    close() {
        this.activeModal.close();
    }

    nukeAccount() {
        this.userService.deleteAccount(this.userId).subscribe(response => {
            this.activeModal.close({success: true, data: response});
        }, error => {
            console.error(error);
            this.activeModal.close({success: false, error: error});
        });
    }

}
