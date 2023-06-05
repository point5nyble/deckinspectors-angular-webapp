import { Component } from '@angular/core';

@Component({
  selector: 'app-part-element',
  templateUrl: './part-element.component.html',
  styleUrls: ['./part-element.component.scss']
})
export class PartElementComponent {
  name:string= "Street Level Access Stairs B6";
  createdOn: string= "Apr 12, 2023";
  createdBy: string= "John Doe";
  assignedTo: string= "Jane Doe";
}
