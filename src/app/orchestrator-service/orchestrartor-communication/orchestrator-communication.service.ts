import { Injectable } from '@angular/core';
import { OrchestratorEventSubjectMapService } from "./orchestrator-event-subject-map.service";
import { Observable } from "rxjs";
import {SubjectInjector} from "../subject/subject-injector";

@Injectable({
  providedIn: 'root'
})
export class OrchestratorCommunicationService {

  constructor(private orchestratorEventSubjectMap: OrchestratorEventSubjectMapService,
              private subjectInjector: SubjectInjector) { }

  public publishEvent(eventName: string, data: any) {
    this.orchestratorEventSubjectMap.eventSubjectMapInstance.get(eventName).next(data);
  }

  public getSubscription(eventName: string):Observable<any> {
    return this.orchestratorEventSubjectMap.eventSubjectMapInstance.get(eventName).asObservable();
  }
}
