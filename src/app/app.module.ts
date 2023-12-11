import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SidebarComponent } from './components/dashboard/sidebar/sidebar.component';
import { FilterComponent } from './components/dashboard/filter/filter.component';
import { ProjectInfoComponent } from './components/dashboard/project-info/project-info.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
// import { LocationListElementComponent } from './components/project/location-list/location-list-element/location-list-element.component';
import { ProjectsListLeftPanelComponent } from './components/project/projects-list-left-panel/projects-list-left-panel.component';
import { LocationListComponent } from './components/project/location-list/location-list.component';
import { LocationDetailsComponent } from './components/project/location-list/location-details/location-details.component';
import { SectionListComponent } from './components/project/location-list/location-details/section-list/section-list.component';
import { SectionComponent } from './components/project/location-list/location-details/section/section.component';
import { SectionInfoComponent } from './components/project/location-list/location-details/section/section-info/section-info.component';
import { SectionPhotosComponent } from './components/project/location-list/location-details/section/section-photos/section-photos.component';
import { SectionListElementComponent } from './components/project/location-list/location-details/section-list/section-list-element/section-list-element.component';
import {NgOptimizedImage} from "@angular/common";
import { NewProjectModalComponent } from './forms/new-project-modal/new-project-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from "@angular/material/input";
import { AssignProjectModalComponent } from './forms/assign-project-modal/assign-project-modal.component';
import { UploadFilesModalComponent } from './forms/upload-fiels-modal/upload-files-modal.component';
import { DownloadFilesModalComponent } from './forms/download-files-modal/download-files-modal.component';
import { VisualDeckReportModalComponent } from './forms/visual-deck-report-modal/visual-deck-report-modal.component';
import { DownloadSpecificReportComponent } from './forms/download-files-modal/download-specific-rerport/download-specific-report/download-specific-report.component';
import {HttpClientModule} from "@angular/common/http";
import { ProjectDetailsComponent } from './components/project/project-details/project-details.component';
import {AppStateServiceModule} from "./app-state-service/app-state-service.module";
import {OrchestratorServiceModule} from "./orchestrator-service/orchestrator-service.module";
import {StoreModule} from "@ngrx/store";
import {projectReducer} from "./app-state-service/project-state/project-reducer";
import { NewLocationModalComponent } from './forms/new-location-modal/new-location-modal.component';
import {
  updatePreviousStateModel
} from "./app-state-service/previous-state/previous-state-reducer";
import {addLeftTreeItems} from "./app-state-service/left-tree-items-state/left-tree-items-state-reducer";
import { NewSubprojectModalComponent } from './forms/new-subproject-modal/new-subproject-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import { ProjectDetailsUpperSectionComponent } from './components/project/project-details/project-details-upper-section/project-details-upper-section.component';
import { SubprojectComponent } from './components/subproject/subproject.component';
import {addPreviousStateModel} from "./app-state-service/back-navigation-state/back-navigation-reducer";
import { NavigationComponentComponent } from './components/common/navigation-component/navigation-component.component';
import { LoadingScreenComponent } from './components/common/loading-screen/loading-screen.component';
import {MatSliderModule} from "@angular/material/slider";
import {MatRadioModule} from "@angular/material/radio";
import { InvasiveSectionModalComponent } from './forms/invasive-section-modal/invasive-section-modal/invasive-section-modal.component';
import { ConclusiveSectionModalComponent } from './forms/conclusive-section-modal/conclusive-section-modal/conclusive-section-modal.component';
import { UsersComponent } from './components/users/users.component';
import { FoldersComponent } from './components/folders/folders.component';
import { ModalComponent } from './components/common/modal/modal.component';
import { MdbModalService } from 'mdb-angular-ui-kit/modal';
import { DeleteConfirmationModalComponent } from './forms/delete-confirmation-modal/delete-confirmation-modal.component';
import { ProjectDescriberComponent } from './components/dashboard/project-describer/project-describer.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ReplaceFinalreportModalComponent } from './forms/replace-finalreport-modal/replace-finalreport-modal.component';
import { ReportsComponent } from './forms/download-files-modal/reports/reports.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SidebarComponent,
    FilterComponent,
    ProjectInfoComponent,
    DashboardComponent,
    ProjectsListLeftPanelComponent,
    // LocationListComponent,
    // LocationListElementComponent,
    LocationDetailsComponent,
    SectionComponent,
    SectionInfoComponent,
    SectionPhotosComponent,
    // SectionListElementComponent,
    NewProjectModalComponent,
    AssignProjectModalComponent,
    UploadFilesModalComponent,
    DownloadFilesModalComponent,
    VisualDeckReportModalComponent,
    ReportsComponent,
    DownloadSpecificReportComponent,
    ProjectDetailsComponent,
    NewLocationModalComponent,
    NewSubprojectModalComponent,
    ProjectDetailsUpperSectionComponent,
    SubprojectComponent,
    NavigationComponentComponent,
    LoadingScreenComponent,
    InvasiveSectionModalComponent,
    ConclusiveSectionModalComponent,
    UsersComponent,
    FoldersComponent,
    ModalComponent,
    DeleteConfirmationModalComponent,
    ModalComponent,
    ProjectDescriberComponent,
    ReplaceFinalreportModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgOptimizedImage,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    AppStateServiceModule,
    OrchestratorServiceModule,
    StoreModule.forRoot(
      {
        project: projectReducer,
        previousState: updatePreviousStateModel,
        leftTreeItemsState: addLeftTreeItems,
        addToPreviousState: addPreviousStateModel

      },
    ),
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatRadioModule,
    LocationListComponent,
    SectionListComponent,
    AngularEditorModule
  ],
  providers: [MdbModalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
