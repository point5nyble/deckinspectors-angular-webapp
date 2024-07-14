import { Injectable } from '@angular/core';
import { HttpsRequestService } from './https-request.service';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class TenantService {
  projectInfo: any = {};

  constructor(private httpRequestService: HttpsRequestService) { }

  setProjectInfo(projectInfo: any) {
    this.projectInfo = projectInfo;
  }

  getProjectInfo() {
    return this.projectInfo;
  }

  getTenant (companyIdentifier: any) {
    return this.httpRequestService.getHttpData(`${environment.apiURL}/tenants/identifier/${companyIdentifier}`);
  }
}
