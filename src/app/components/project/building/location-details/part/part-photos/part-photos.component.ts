import {Component, Input, OnInit} from '@angular/core';
import {InspectionReport} from "../../../../../../common/models/inspection-report";

@Component({
  selector: 'app-part-photos',
  templateUrl: './part-photos.component.html',
  styleUrls: ['./part-photos.component.scss']
})
export class PartPhotosComponent implements OnInit{
  @Input() sectionReport!: InspectionReport;
  ngOnInit(): void {
    console.log(this.sectionReport.images);
  }


}
