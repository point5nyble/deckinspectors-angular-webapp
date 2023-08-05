import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {
  OrchestratorEventSubjectMapService
} from "../orchestrartor-communication/orchestrator-event-subject-map.service";
import {OrchestratorEventName} from "../models/orchestrator-event-name";

@Injectable()
export class SectionClickedSubject extends Subject<any> {
  constructor(private orchestratorEventSubjectMap:OrchestratorEventSubjectMapService) {
    super();
    this.orchestratorEventSubjectMap.addEventSubjectToMap(OrchestratorEventName.SECTION_CLICKED,this);
  }
}
