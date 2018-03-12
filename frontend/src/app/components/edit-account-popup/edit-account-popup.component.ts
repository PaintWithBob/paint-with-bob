import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../providers/user-service/user.service';

@Component({
    selector: 'edit-account-popup',
    templateUrl: './edit-account-popup.component.html',
    styleUrls: ['./edit-account-popup.component.scss']
})
export class EditAccountPopupComponent implements OnInit {

    @Input() user;

    constructor(
        private activeModal: NgbActiveModal,
        private userService: UserService
    ) { }

    ngOnInit() { }

    close() {
        this.activeModal.close();
    }

    submit(form: NgForm) {
        if(form.valid) {
            console.log(this.user);
            // TODO: Test This
            // this.userService.editAccountInfo(this.user.id, this.user).subscribe(response => {
            //     console.log(response);
            // }, error => {
            //     console.error(error);
            // });
        }
    }

}
