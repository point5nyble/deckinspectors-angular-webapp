import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProjectEventListenerService} from "./project-state/project-event-listener.service";



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    ProjectEventListenerService
  ]
})
export class AppStateServiceModule {
  constructor(private projectEventListenerService: ProjectEventListenerService) {
  }
}
