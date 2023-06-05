import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProjectComponent } from './components/project/project.component';
import { ProjectInfoComponent } from './components/dashboard/project-info/project-info.component';

const routes: Routes = [
  {path: 'login',component: LoginComponent},
  {path: 'dashboard',component: DashboardComponent},
  {path: 'project-list', component:ProjectInfoComponent},
  {path: '',redirectTo: '/dashboard',pathMatch: 'full'}

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
