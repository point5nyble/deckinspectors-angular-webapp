import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SidebarComponent } from './components/dashboard/sidebar/sidebar.component';
import { FilterComponent } from './components/dashboard/filter/filter.component';
import { ProjectInfoComponent } from './components/dashboard/project-info/project-info.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LocationListElementComponent } from './components/project/location-list/location-list-element/location-list-element.component';
import { ProjectsListLeftPanelComponent } from './components/project/projects-list-left-panel/projects-list-left-panel.component';
import { ProjectComponent } from './components/project/project.component';
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


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SidebarComponent,
    FilterComponent,
    ProjectInfoComponent,
    DashboardComponent,
    ProjectsListLeftPanelComponent,
    ProjectComponent,
    LocationListComponent,
    LocationListElementComponent,
    LocationDetailsComponent,
    SectionListComponent,
    SectionComponent,
    SectionInfoComponent,
    SectionPhotosComponent,
    SectionListElementComponent,
    NewProjectModalComponent,
    AssignProjectModalComponent,
    UploadFilesModalComponent,
    DownloadFilesModalComponent,
    VisualDeckReportModalComponent,
    DownloadSpecificReportComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgOptimizedImage,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
