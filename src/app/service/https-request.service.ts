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
       }),
       timeout: 600000, // 10 minutes timeout in milliseconds
      //  withCredentials: true
     };
     return this.http.post<T>(url, data,httpOptions);
   }

  public postHttpDataForMultipart<T>(url:string, data:any): Observable<T> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'multipart/form-data'
      }),
      // withCredentials: true
    };
    return this.http.post<T>(url, data,httpOptions);
  }

  public putHttpData<T>(url:string, data:any): Observable<T> {
    const httpOptions = {
          headers: new HttpHeaders({
              'Content-Type': 'application/json'
          }),
          // withCredentials: true
      };
      return this.http.put<T>(url, data,httpOptions);
  }

  public deleteHttpData<T>(url:string): Observable<T> {
    return this.http.delete<T>(url);
  }

}
