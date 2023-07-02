import {Component, Input, OnInit} from '@angular/core';
import {InspectionReport} from "../../../../../../common/models/inspection-report";

@Component({
  selector: 'app-section-photos',
  templateUrl: './section-photos.component.html',
  styleUrls: ['./section-photos.component.scss']
})
export class SectionPhotosComponent implements OnInit{
  @Input() sectionReport!: InspectionReport;
  ngOnInit(): void {
    console.log(this.sectionReport?.images);
  }


}
