import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProjectEventListenerService} from "./project-state/project-event-listener.service";
import {PreviousStateEventListenerService} from "./previous-state/previous-state-event-listener.service";
import {
  LeftTreeItemsStateEventListenerService
} from "./left-tree-items-state/left-tree-items-state-event-listener.service";



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    ProjectEventListenerService,
    PreviousStateEventListenerService,
    LeftTreeItemsStateEventListenerService
  ]
})
export class AppStateServiceModule {
  constructor(private projectEventListenerService: ProjectEventListenerService,
              private previousStateEventListenerService: PreviousStateEventListenerService,
              private leftTreeItemsStateEventListenerService: LeftTreeItemsStateEventListenerService) {
  }
}
