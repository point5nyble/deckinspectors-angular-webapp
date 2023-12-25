import { Injectable } from '@angular/core';
import {HttpsRequestService} from "../../service/https-request.service";
import {Router} from "@angular/router";
import { environment } from '../../../environments/environment';


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
        this.httpsRequestService.getHttpData<any>(`${environment.apiURL}/user/${username}`).subscribe(
        user => {
          let response = true;
          if (!(["web", "both"].includes(user.access_type.toLowerCase()))){
            alert("Incorrect username or password");
            return false;
          }
          let url = environment.apiURL + '/user/login';
          this.httpsRequestService.postHttpData(url, data).subscribe(
              res => {
                console.log(res);
                localStorage.setItem('username', username);
                this.router.navigate(['/dashboard'])
              },
              err => {
                console.error("Incorrect username or password");
                response = false;
                alert("Incorrect username or password");
              }
          )
          return response;
          }, err=>{
            console.error("Incorrect username or password");
            alert("Incorrect username or password");
          })
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
