import {Injectable, OnDestroy} from '@angular/core';
import {Store} from "@ngrx/store";
import {
  OrchestratorCommunicationService
} from "../../orchestrator-service/orchestrartor-communication/orchestrator-communication.service";
import {OrchestratorEventName} from "../../orchestrator-service/models/orchestrator-event-name";
import { updatePreviousState} from "./previous-state-action";
import {PreviousStateModelQuery} from "./previous-state-selector";

@Injectable()
export class PreviousStateEventListenerService implements OnDestroy {

  constructor(private store: Store<any>,
              private orchestratorCommunicationService:OrchestratorCommunicationService) {
    this.subscribeToPreviousStateUpdate();
    this.publishPreviousState();
  }

  ngOnDestroy(): void {
  }

  private subscribeToPreviousStateUpdate() {
    this.orchestratorCommunicationService.getSubscription(OrchestratorEventName.Previous_Button_Click).subscribe(data => {
      this.store.dispatch(updatePreviousState({previousState: data}));
    })
  }

  private publishPreviousState() {
    this.store.select(PreviousStateModelQuery.getPreviousStateModel).subscribe(previousState => {
      this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.Application_State_change,previousState);
    })
  }
}
