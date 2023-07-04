import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OrchestratorEventSubjectMapService} from "./orchestrartor-communication/orchestrator-event-subject-map.service";
import {SubjectInjector} from "./subject/subject-injector";
import {ProjectUpdateStateSubject} from "./subject/project-update-state-subject";
import {ApplicationStateChangeSubject} from "./subject/application-state-change-subject";
import {ShowProjectDetailsSubject} from "./subject/show-project-details-subject";
import {LocationClickSubject} from "./subject/location-click-subject";
import {PreviousButtonClickSubject} from "./subject/previous-button-click-subject";
import {ShowAllProjectSubject} from "./subject/show-all-project-subject";



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    OrchestratorEventSubjectMapService,
    SubjectInjector,
    ProjectUpdateStateSubject,
    ApplicationStateChangeSubject,
    ShowProjectDetailsSubject,
    LocationClickSubject,
    PreviousButtonClickSubject,
    ShowAllProjectSubject
  ]
})
export class OrchestratorServiceModule { }
