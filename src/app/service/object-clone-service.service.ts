import { Injectable } from '@angular/core';
import * as clone from 'clone';
@Injectable({
  providedIn: 'root'
})
export class ObjectCloneServiceService {

  constructor() { }

  public static deepClone<T>(obj: T): T {
    return clone<T>(obj)
  }

}
