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
    formData.append('containerName', data.containerName.replace(/\s+/g, '').toLowerCase());
    formData.append('uploader', 'deck');
    formData.append('entityName', data.entityName);
    let url = environment.apiURL + '/image/upload';
    let token = localStorage.getItem('token');
    let httpOptions = {};
    if (token !== null){
      httpOptions = {
        headers: new HttpHeaders({
          'Authorization': token,
        })
      }
    }
    return this.http.post(url, formData, httpOptions)
  }
}
