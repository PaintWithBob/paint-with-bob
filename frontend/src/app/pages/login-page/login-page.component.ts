import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../providers/auth-service/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  form: any = {};

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.form.email = "";
    this.form.password = "";
  }

  submit(form: NgForm) {
    if(form.valid) {
      this.authService.login(this.form);
    }
  }

}
