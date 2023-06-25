import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OrchestratorEventSubjectMapService} from "./orchestrartor-communication/orchestrator-event-subject-map.service";
import {SubjectInjector} from "./subject/subject-injector";
import {ProjectUpdateStateSubject} from "./subject/project-update-state-subject";
import {ApplicationStateChangeSubject} from "./subject/application-state-change-subject";



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    OrchestratorEventSubjectMapService,
    SubjectInjector,
    ProjectUpdateStateSubject,
    ApplicationStateChangeSubject
  ]
})
export class OrchestratorServiceModule { }
