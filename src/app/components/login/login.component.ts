import {Component, OnInit} from '@angular/core';
import {LoginService} from "./login.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  username: string = '';
  password: string = '';

  constructor(private loginService: LoginService,
              private router: Router) {}

  ngOnInit(): void {
    this.login();
  }
  login() {
    console.log("Inside Login")
    if (!this.loginService.isLoggedIn() && this.username !== '' && this.password !== '') {
      this.loginService.login(this.username, this.password);
    } else if (this.loginService.isLoggedIn()) {
      this.router.navigate(['/dashboard'])
    }
  }
}
