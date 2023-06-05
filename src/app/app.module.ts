import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SidebarComponent } from './components/dashboard/sidebar/sidebar.component';
import { FilterComponent } from './components/dashboard/filter/filter.component';
import { ProjectInfoComponent } from './components/dashboard/project-info/project-info.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LocationComponent } from './components/project/building/location/location.component';
import { ProjectsListLeftPanelComponent } from './components/project/projects-list-left-panel/projects-list-left-panel.component';
import { ProjectComponent } from './components/project/project.component';
import { BuildingComponent } from './components/project/building/building.component';
import { LocationDetailsComponent } from './components/project/building/location-details/location-details.component';
import { PartsComponent } from './components/project/building/location-details/parts/parts.component';
import { PartComponent } from './components/project/building/location-details/part/part.component';
import { PartInfoComponent } from './components/project/building/location-details/part/part-info/part-info.component';
import { PartPhotosComponent } from './components/project/building/location-details/part/part-photos/part-photos.component';
import { PartElementComponent } from './components/project/building/location-details/parts/part-element/part-element.component';
import {NgOptimizedImage} from "@angular/common";


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
    BuildingComponent,
    LocationComponent,
    LocationDetailsComponent,
    PartsComponent,
    PartComponent,
    PartInfoComponent,
    PartPhotosComponent,
    PartElementComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgOptimizedImage
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
