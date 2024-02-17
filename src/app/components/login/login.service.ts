import { Injectable } from '@angular/core';
import {HttpsRequestService} from "../../service/https-request.service";
import {Router} from "@angular/router";
import { environment } from '../../../environments/environment';
import { TenantService } from 'src/app/service/tenant.service';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpsRequestService:HttpsRequestService,
              private router: Router,
              private tenantService: TenantService) { }

    login(username: string,  password: string) {
        let data = {
          username: username,
          password: password
        }
        this.httpsRequestService.getHttpData<any>(`${environment.apiURL}/login/${username}`).subscribe(
        user => {
          let response = true;
          if (!(["web", "both"].includes(user.access_type.toLowerCase()))){
            alert("Incorrect username or password");
            return false;
          }
          console.log(localStorage.getItem('companyLogo'));
          let url = environment.apiURL + '/login/login';
          this.httpsRequestService.postHttpData(url, data).subscribe(
              async (res: any) => {
                console.log(res);
                localStorage.setItem('username', username);
                localStorage.setItem('token', res.token);
                const tenant: any = await this.tenantService.getTenant(user.companyIdentifier).toPromise();
                console.log(tenant);
                localStorage.setItem('companyLogo', tenant.Tenant.icons.logoUrl);
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
            console.error(err);
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
