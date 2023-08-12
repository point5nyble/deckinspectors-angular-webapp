import { Injectable } from '@angular/core';
import {HttpsRequestService} from "../../service/https-request.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpsRequestService:HttpsRequestService,
              private router: Router) { }

    login(username: string,  password: string) {
        let data = {
          username: username,
          password: password
        }
        let url = 'https://deckinspectors-dev.azurewebsites.net/api/user/login';
        this.httpsRequestService.postHttpData(url, data).subscribe(
            res => {
              console.log(res);
              localStorage.setItem('username', username);
              this.router.navigate(['/dashboard'])
              return true;
            },
            err => {
              console.error("Incorrect username or password");
              return false;
            }
        )
    }

    logout() {
        localStorage.removeItem('username');
    }


    isLoggedIn() {
        return localStorage.getItem('username') !== null;
    }

    getUsername() {
        return localStorage.getItem('username');
    }
}
