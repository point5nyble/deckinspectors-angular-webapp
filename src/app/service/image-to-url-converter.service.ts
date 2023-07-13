import { Injectable } from '@angular/core';
import {HttpsRequestService} from "./https-request.service";

@Injectable({
  providedIn: 'root'
})
export class ImageToUrlConverterService {

  constructor(private httpsRequestService:HttpsRequestService) {

  }

    public convertImageToUrl(data:any): string {

      let url = 'https://deckinspectors-dev.azurewebsites.net/api/image/upload';
      let s3URL='';

      this.httpsRequestService.postHttpData(url, data).subscribe(
        (response: any) => {
          console.log(response);
          s3URL = response.data.url;
        },
        error => {
          console.log(error)
        }
      );
      return s3URL;
    }

}
