import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../providers/auth-service/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {

  form: any = {};

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.form.email = "";
    this.form.password = "";
    this.form.username = "";
  }

  submit(form: NgForm) {
    if(form.valid) {
      this.authService.register(this.form).subscribe(user => {
        console.log(user);
      });
    }
  }

}
