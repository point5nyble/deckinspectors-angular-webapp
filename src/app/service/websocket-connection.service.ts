import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import {webSocket} from 'rxjs/webSocket';
import { HttpsRequestService } from './https-request.service';
import { environment } from 'src/environments/environment';
import { RtlScrollAxisType } from '@angular/cdk/platform';
@Injectable({
  providedIn: 'root'
})
export class WebsocketConnectionService {
  
  
  constructor(private httpsRequestService:HttpsRequestService) { 
    
  }
  //private wssURL:string='';

  private getWssUrl(): Observable<string> {
    const azureFuncEndpoint = 'https://inspectionreportgenerator.azurewebsites.net/api/negotiate';

    return this.httpsRequestService.getHttpTextData(azureFuncEndpoint);
  }
  // private getWssUrl()  {
  //   const azureFuncEndpoint = 'https://inspectionreportgenerator.azurewebsites.net/api/negotiate';
  //   this.httpsRequestService.getHttpData<any>(azureFuncEndpoint).subscribe({
  //     next: value => {this.wssURL= value},
  //     error: err => {console.error('Observable emitted an error: ' + err); return '';},
  //     complete: () => {console.log('Observable emitted the complete notification'); return ''; }
  //   });
  // }
  public connect(): Observable<any> {
    return this.getWssUrl().pipe(
      switchMap((value) => {
        if (value) {
          // this.wssURL = value;
          // const wssLink = this.wssURL;

          return new Observable<any>((subscriber) => {
            const subject = webSocket(value);
            subject.subscribe(
              (msg) => subscriber.next(msg),
              (err) => console.log(err),
              () => console.log('complete')
            );
          });
        } else {
          // If value is falsy, return an observable with a placeholder value
          return of('WebSocket URL not available');
        }
      })
    );
  }
}
