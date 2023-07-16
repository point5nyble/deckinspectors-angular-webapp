import {Subject} from "rxjs";
import {
  OrchestratorEventSubjectMapService
} from "../orchestrartor-communication/orchestrator-event-subject-map.service";
import {OrchestratorEventName} from "../models/orchestrator-event-name";
import {Injectable} from "@angular/core";

@Injectable()
export class ShowProjectDetailsSubject extends Subject<any> {
  constructor(private orchestratorEventSubjectMap:OrchestratorEventSubjectMapService) {
    super();
    this.orchestratorEventSubjectMap.addEventSubjectToMap(OrchestratorEventName.SHOW_SCREEN,this);
  }
}
