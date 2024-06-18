import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProjectInfoComponent } from './components/dashboard/project-info/project-info.component';
import {ProjectDetailsComponent} from "./components/project/project-details/project-details.component";
import { UsersComponent } from './components/users/users.component';
import { FoldersComponent } from './components/folders/folders.component';
import { CustomFormsComponent } from './components/custom-forms/custom-forms.component';

const routes: Routes = [
  {path: 'login',component: LoginComponent},
  {path: 'dashboard',component: DashboardComponent},
  {path: 'project-list', component:ProjectInfoComponent},
  {path: '',redirectTo: '/dashboard',pathMatch: 'full'},
  {path: 'project', component:ProjectDetailsComponent},
  {path: 'users', component: ((JSON.parse(localStorage.getItem('user')!))?.role === "admin")? UsersComponent : DashboardComponent},
  {path: 'custom-forms', component: ((JSON.parse(localStorage.getItem('user')!))?.role === "admin")? CustomFormsComponent : DashboardComponent},
  // {path: 'folders', component: ((JSON.parse(localStorage.getItem('user')!))?.role === "admin")? FoldersComponent : DashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
