import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HttpsRequestService {

  constructor(private http: HttpClient) {}
  public getHttpData<T>(url:string): Observable<T> {
    let token = localStorage.getItem('token');
    let httpOptions = {};
    if (token !== null){
      httpOptions = {
        headers: new HttpHeaders({
          'Authorization': token
        })
      }
    }
      return this.http.get<T>(url, httpOptions);
  }
  public getHttpTextData(url:string): Observable<string> {
    let token = localStorage.getItem('token');
    let httpOptions = {headers: {}};
    if (token !== null){
      httpOptions = {
        headers: new HttpHeaders({
          'Authorization': token
        })
      }
    }
    return this.http.get(url,{ responseType: 'text' , headers: httpOptions.headers});
}

  public getFile<T>(url:string): Observable<T> {
    let token = localStorage.getItem('token');
    let httpOptions = {};
    if (token !== null){
      httpOptions = {
        headers: new HttpHeaders({
          'Authorization': token
        }),
        responseType: 'blob'
      }
    }
      return this.http.get<T>(url, httpOptions);
  }

  public postHttpDataForFile<T>(url:string, data:any): Observable<T> {
    let token = localStorage.getItem('token');
    let httpOptions = {};
    if (token !== null){
      httpOptions = {
        headers: new HttpHeaders({
         'Content-Type': 'application/json',
          'Authorization': token
       }),
       timeout: 600000, // 10 minutes timeout in milliseconds
      //  withCredentials: true
      responseType: 'blob'

     };
    }
    
     return this.http.post<T>(url, data,httpOptions);
   }
  
   public postHttpData<T>(url:string, data:any): Observable<T> {
    let token = localStorage.getItem('token');
    let httpOptions = {};
    if (token !== null){
      httpOptions = {
        headers: new HttpHeaders({
         'Content-Type': 'application/json',
          'Authorization': token
       }),
       timeout: 600000, // 10 minutes timeout in milliseconds
      //  withCredentials: true
     };
    }
    
     return this.http.post<T>(url, data,httpOptions);
   }

  public postHttpDataForMultipart<T>(url:string, data:any): Observable<T> {
    let token = localStorage.getItem('token');
    let httpOptions = {};
    if (token !== null){
      httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'multipart/form-data',
          'Authorization': localStorage.getItem('token')!
        }),
        // withCredentials: true
      };
    }
    return this.http.post<T>(url, data,httpOptions);
  }

  public putHttpData<T>(url:string, data:any): Observable<T> {
    let token = localStorage.getItem('token');
    let httpOptions = {};
    if (token !== null){
      httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': token
        }),
        // withCredentials: true
      };
    };
      return this.http.put<T>(url, data,httpOptions);
  }

  public deleteHttpData<T>(url:string): Observable<T> {
    let token = localStorage.getItem('token');
    let httpOptions = {};
    if (token !== null){
      httpOptions = {
        headers: new HttpHeaders({
          'Authorization': token
        })
      }
    }
    return this.http.delete<T>(url, httpOptions);
  }

}
