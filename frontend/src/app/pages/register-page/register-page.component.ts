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
        this.formError = "Passwords must match.";
      } else {
        this.authService.register(this.form).subscribe(login => {
          this.registerSuccess = "Successfully created account, logging in...";
          setTimeout(() => {
            this.registerSuccess = null;
            this.router.navigate(['/account']);
          }, 3000);
        }, error => {
          this.formError = error._body;
        }); 
      }
    }
  }

}
