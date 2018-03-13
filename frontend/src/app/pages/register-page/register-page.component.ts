import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../providers/auth-service/auth.service';

@Component({
    selector: 'app-register-page',
    templateUrl: './register-page.component.html',
    styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {

    form: any = {};
    formError: any;
    registerSuccess: any;

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        this.form.email = "";
        this.form.password = "";
        this.form.confPass = "";
        this.form.username = "";
    }

    submit(form: NgForm) {
        this.formError = null;
        if(form.valid) {
            if(this.form.password != this.form.confPass) {
                this.formError = "The passwords need to match. Everyone needs a friend, after all.";
            } else {
                this.authService.register(this.form).subscribe(login => {
                    this.router.navigate(['/account']);
                }, error => {
                    this.formError = error.error;
                });
            }
        }
    }
}
