import {Injectable, OnDestroy} from '@angular/core';
import {Store} from "@ngrx/store";
import {
  OrchestratorCommunicationService
} from "../../orchestrator-service/orchestrartor-communication/orchestrator-communication.service";
import {OrchestratorEventName} from "../../orchestrator-service/models/orchestrator-event-name";
import {LeftTreeListModelQuery} from "./left-tree-items-state-selector";
import {saveLeftTreeItems} from "./left-tree-items-state-action";


@Injectable()
export class LeftTreeItemsStateEventListenerService implements OnDestroy {

  constructor(private store: Store<any>,
              private orchestratorCommunicationService:OrchestratorCommunicationService) {
    this.subscribeToPreviousStateUpdate();
    this.publishPreviousState();
  }

  ngOnDestroy(): void {
  }

  private subscribeToPreviousStateUpdate() {
    this.orchestratorCommunicationService.getSubscription(OrchestratorEventName.Left_Tree_Data).subscribe(data => {
      this.store.dispatch(saveLeftTreeItems({leftTreeItemsState: data}));
    })
  }

  private publishPreviousState() {
    this.store.select(LeftTreeListModelQuery.getLeftTreeList).subscribe(previousState => {
      this.orchestratorCommunicationService.publishEvent(OrchestratorEventName.Application_State_change,previousState);
    })
  }
}
