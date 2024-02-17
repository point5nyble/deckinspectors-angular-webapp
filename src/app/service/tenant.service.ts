import { Injectable } from '@angular/core';
import { HttpsRequestService } from './https-request.service';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class TenantService {

  constructor(private httpRequestService: HttpsRequestService) { }

  getTenant (companyIdentifier: any) : Promise<void>{
    return new Promise((resolve, reject)=>{
      this.httpRequestService.getHttpData(`${environment.apiURL}/tenants/${companyIdentifier}`).subscribe(
        (res:any)=>{
          localStorage.setItem('companyLogo', res.Tenant.icons.companyLogo);
          resolve();
        },
        (err: any)=>{
          console.log(err);
          reject();
        }
      );
    })
  }
}
