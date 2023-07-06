import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProjectEventListenerService} from "./project-state/project-event-listener.service";
import {PreviousStateEventListenerService} from "./previous-state/previous-state-event-listener.service";



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    ProjectEventListenerService,
    PreviousStateEventListenerService
  ]
})
export class AppStateServiceModule {
  constructor(private projectEventListenerService: ProjectEventListenerService,
              private previousStateEventListenerService: PreviousStateEventListenerService) {
  }
}
