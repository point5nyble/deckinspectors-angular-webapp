import {Subject} from "rxjs";
import {
  OrchestratorEventSubjectMapService
} from "../orchestrartor-communication/orchestrator-event-subject-map.service";
import {OrchestratorEventName} from "../models/orchestrator-event-name";
import {Injectable} from "@angular/core";

@Injectable()
export class UpdateLeftTreeDataSubject extends Subject<any> {
  constructor(private orchestratorEventSubjectMap:OrchestratorEventSubjectMapService) {
    super();
    this.orchestratorEventSubjectMap.addEventSubjectToMap(OrchestratorEventName.UPDATE_LEFT_TREE_DATA,this);
  }
}
