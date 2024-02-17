import { Injectable } from '@angular/core';
import { HttpsRequestService } from './https-request.service';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class TenantService {

  constructor(private httpRequestService: HttpsRequestService) { }

  getTenant (companyIdentifier: any) {
    return this.httpRequestService.getHttpData(`${environment.apiURL}/tenants/${companyIdentifier}`);
  }
}
