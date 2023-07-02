import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

@Injectable()
export class OrchestratorEventSubjectMapService {

  private eventSubjectMap;
  constructor() {
    this.eventSubjectMap = new Map();
  }

  get eventSubjectMapInstance() {
    return this.eventSubjectMap;
  }

  addEventSubjectToMap(eventName:string, eventSubject:Subject<any>) {
    this.eventSubjectMap.set(eventName, eventSubject);
  }
}
