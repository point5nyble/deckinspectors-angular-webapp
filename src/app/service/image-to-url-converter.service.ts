import { Injectable } from '@angular/core';
import {HttpsRequestService} from "./https-request.service";

@Injectable({
  providedIn: 'root'
})
export class ImageToUrlConverterService {

  constructor(private httpsRequestService:HttpsRequestService) {

  }

    public convertImageToUrl(image:File, filePaths:string): string {
      console.log(image);
      console.log(filePaths);
      let url = 'https://deckinspectors-dev.azurewebsites.net/api/image/upload';
      let s3URL='';
      let data = {
        "blobName": image,
        "containerName": "deck-rj",
        "filePath": filePaths
      }
      this.httpsRequestService.postHttpData(url, data).subscribe(
        (response: any) => {
          console.log(response);
        },
        error => {
          console.log(error)
        }
      );
      return s3URL;
    }

}
