import { Component,Input} from '@angular/core';

@Component({
  selector: 'app-project-describer',
  templateUrl: './project-describer.component.html',
  styleUrls: ['./project-describer.component.scss']
})
export class ProjectDescriberComponent {
  // @Input() projectInfo!: Project;
  isAdmin: boolean = ((JSON.parse(localStorage.getItem('user')!))?.role === "admin");
}
