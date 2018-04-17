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
    form: any;
    formError: any;

    constructor(
        private activeModal: NgbActiveModal,
        private userService: UserService
    ) {
      this.form = {};
    }

    ngOnInit() {
        if(this.user) {
            const user = Object.assign({}, this.user);
            this.form = {
                username: user.username,
                email: user.email
            }
        }
    }

    close() {
        this.activeModal.close();
    }

    submit(form: NgForm) {
        this.formError = null;
        if(form.valid) {
            this.userService.editAccountInfo(this.user._id, this.form).subscribe(response => {
                this.activeModal.close({success: true, data: response});
            }, error => {
                console.error(error);
                this.formError = error.error;
            });
        }
    }

}
