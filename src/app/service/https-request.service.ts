import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HttpsRequestService {

  constructor(private http: HttpClient) {}
  public getHttpData<T>(url:string): Observable<T> {
      return this.http.get<T>(url);
  }
   public postHttpData<T>(url:string, data:any): Observable<T> {
     const httpOptions = {
        headers: new HttpHeaders({
         'Content-Type': 'application/json'
       })
     };
     return this.http.post<T>(url, data,httpOptions);
   }
}
