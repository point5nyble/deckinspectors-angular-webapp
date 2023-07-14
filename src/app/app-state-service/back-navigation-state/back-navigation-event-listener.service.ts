import {Injectable, OnDestroy} from '@angular/core';
import {Store} from "@ngrx/store";
import {
  OrchestratorCommunicationService
} from "../../orchestrator-service/orchestrartor-communication/orchestrator-communication.service";
import {OrchestratorEventName} from "../../orchestrator-service/models/orchestrator-event-name";
import {addPreviousState, removePreviousState} from "./back-navigation-action";
import {BackNavigation} from "./back-navigation-selector";


@Injectable()
export class BackNavigationEventListenerService implements OnDestroy {

  constructor(private store: Store<any>,
              private orchestratorCommunicationService:OrchestratorCommunicationService) {
    this.subscribeToPreviousStateUpdate();
    this.publishPreviousState();
  }

  ngOnDestroy(): void {
  }

  private subscribeToPreviousStateUpdate() {
    this.orchestratorCommunicationService.getSubscription(OrchestratorEventName.Add_ELEMENT_TO_PREVIOUS_BUTTON_LOGIC).subscribe(data => {
      this.store.dispatch(addPreviousState({addToPreviousState: data}));
    })
    this.orchestratorCommunicationService.getSubscription(OrchestratorEventName.REMOVE_ELEMENT_FROM_PREVIOUS_BUTTON_LOGIC).subscribe(data => {
      this.store.dispatch(removePreviousState({addToPreviousState: data}));
    })
  }

  private publishPreviousState() {
    this.store.select(BackNavigation.getPreviousStateModelChain).subscribe(previousState => {
      this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.Application_State_change,previousState);
    })
  }
}
