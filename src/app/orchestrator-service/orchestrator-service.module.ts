import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OrchestratorEventSubjectMapService} from "./orchestrartor-communication/orchestrator-event-subject-map.service";
import {SubjectInjector} from "./subject/subject-injector";
import {ProjectUpdateStateSubject} from "./subject/project-update-state-subject";
import {ApplicationStateChangeSubject} from "./subject/application-state-change-subject";
import {ShowProjectDetailsSubject} from "./subject/show-project-details-subject";
import {PreviousButtonClickSubject} from "./subject/previous-button-click-subject";
import {FetchLeftTreeDataStateSubject} from "./subject/fetch-left-tree-data-state-subject";
import {AddElementToPreviousButtonLogicSubject} from "./subject/add-element-to-previous-button-logic-subject";
import {RemoveElementToPreviousButtonLogicSubject} from "./subject/remove-element-to-previous-button-logic-subject";
import {UpdateLeftTreeDataSubject} from "./subject/update-left-tree-data-subject";
import {SectionClickedSubject} from "./subject/section-clicked-subject";
import {InvasiveButtonClickSubject} from "./subject/invasive-button-click-subject";



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
    PreviousButtonClickSubject,
    FetchLeftTreeDataStateSubject,
    AddElementToPreviousButtonLogicSubject,
    RemoveElementToPreviousButtonLogicSubject,
    UpdateLeftTreeDataSubject,
    SectionClickedSubject,
    InvasiveButtonClickSubject
  ]
})
export class OrchestratorServiceModule { }
