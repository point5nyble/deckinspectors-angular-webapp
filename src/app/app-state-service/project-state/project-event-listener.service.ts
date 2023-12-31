import {Injectable, OnDestroy} from '@angular/core';
import {Store} from "@ngrx/store";
import {
  OrchestratorCommunicationService
} from "../../orchestrator-service/orchestrartor-communication/orchestrator-communication.service";
import {OrchestratorEventName} from "../../orchestrator-service/models/orchestrator-event-name";
import {updateInvasiveBtnState, updateProject} from "./project-action";
import {ProjectQuery} from "./project-selector";

@Injectable()
export class ProjectEventListenerService implements OnDestroy {

  constructor(private store: Store<any>,
              private orchestratorCommunicationService:OrchestratorCommunicationService) {
    this.subscribeToProjectChangeEvents();
    this.publishProjectChangeEvents();
  }

  ngOnDestroy(): void {
  }

  private subscribeToProjectChangeEvents() {
    this.orchestratorCommunicationService.getSubscription(OrchestratorEventName.PROJECT_STATE_UPDATE).subscribe(data => {
      this.store.dispatch(updateProject({project: data}));
    })
    this.orchestratorCommunicationService.getSubscription(OrchestratorEventName.INVASIVE_BTN_DISABLED).subscribe(data => {
      this.store.dispatch(updateInvasiveBtnState({project: data}));
    })
  }

  private publishProjectChangeEvents() {
    this.store.select(ProjectQuery.getProjectModel).subscribe(project => {
      this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.Application_State_change,project);
    })
  }
}
