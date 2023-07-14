import { Injectable } from '@angular/core';
import {HttpsRequestService} from "./https-request.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class ImageToUrlConverterService {

  constructor(private httpsRequestService:HttpsRequestService,private http: HttpClient) {

  }

     public async convertImageToUrl(data:any): Promise<string> {
    //console.log(data);
    const formData = new FormData();
    formData.append('picture',data.picture, data.picture.name);
    formData.append('containerName', 'inor');
    formData.append('uploader', 'deck');
    formData.append('entityName', 'Inorbit Mall');
    let url = 'https://deckinspectors-dev.azurewebsites.net/api/image/upload';
    //let url = 'https://localhost:3000/api/image/upload';
    let s3URL='';

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data'); // Set the correct Content-Type

  

    try {
      const response = await this.http.post(url, formData, { headers }).toPromise();
      if (response) {
        console.log(response);
      } else {
        console.log(response);
      }
    } catch (error) {
      // Handle error
      console.error('Error uploading image:', error);
      throw error;
    }
      return s3URL;
    }

}
