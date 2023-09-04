import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageToUrlConverterService {

  constructor(private http: HttpClient) {
  }
  public convertImageToUrl(data:any) {
    const formData = new FormData();
    formData.append('picture',data.picture, data.picture.name);
    formData.append('containerName', data.containerName);
    formData.append('uploader', 'deck');
    formData.append('entityName', data.entityName);
    let url = environment.apiURL + '/image/upload';
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data'); // Set the correct Content-Type
    return this.http.post(url, formData, { headers })
  }
}
