import { Component } from '@angular/core';

@Component({
  selector: 'app-part-info',
  templateUrl: './part-info.component.html',
  styleUrls: ['./part-info.component.scss']
})
export class PartInfoComponent {
  rows = [
    { column1: 'Data 1', column2: 'Data 2' },
    { column1: 'Data 3', column2: 'Data 4' },
    { column1: 'Data 5', column2: 'Data 6' },
    { column1: 'Data 7', column2: 'Data 8' },
    { column1: 'Data 9', column2: 'Data 10' },
    { column1: 'Data 1', column2: 'Data 2' },
    { column1: 'Data 3', column2: 'Data 4' },
    { column1: 'Data 5', column2: 'Data 6' },
    { column1: 'Data 7', column2: 'Data 8' },
    { column1: 'Data 9', column2: 'Data 10' }
  ];
}
