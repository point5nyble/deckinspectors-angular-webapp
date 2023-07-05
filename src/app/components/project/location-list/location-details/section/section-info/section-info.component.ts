import {Component, Input, OnInit} from '@angular/core';
import {InspectionReport} from "../../../../../../common/models/inspection-report";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {
  VisualDeckReportModalComponent
} from "../../../../../../forms/visual-deck-report-modal/visual-deck-report-modal.component";

@Component({
  selector: 'app-section-info',
  templateUrl: './section-info.component.html',
  styleUrls: ['./section-info.component.scss']
})
export class SectionInfoComponent implements OnInit{
  rows: { column1: string; column2: any }[] = [];
  sectionReport_!: InspectionReport;
  englishNamesMap!: { [key: string]: string };
  constructor(private dialog: MatDialog) {
    this.englishNamesMap = {
      name: "Name",
      exteriorelements: "Exterior Elements",
      waterproofingelements: "Waterproofing Elements",
      visualreview: "Visual Review",
      visualsignsofleak: "Visual Signs of Leak",
      furtherinvasivereviewrequired: "Further Invasive Review Required",
      conditionalassessment: "Conditional Assessment",
      additionalconsiderations: "Additional Considerations or Concerns",
      eee: "Life Expectancy Exterior Elevated Elements (EEE)",
      lbc: "Life Expectancy Load Bearing Componenets (LBC)",
      awe: "Life Expectancy Associated Waterproofing Elements (AWE)",
    };
  }
  @Input()
  set sectionReport(section: InspectionReport) {
    this.sectionReport_ = section;
    this.ngOnInit();
  }

  ngOnInit(): void {
    this.rows = [];
    if (this.sectionReport_ != null || this.sectionReport_ != undefined) {
      for (let key in this.englishNamesMap) {
        if (this.englishNamesMap.hasOwnProperty(key)) {
          const value:string = this.englishNamesMap[key];
          this.rows.push(
            {
              column1: value,
              column2: this.sectionReport_[key]
            }
          );
        }
      }
    }
  }

  editVisualDeckReportModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "600px";
    dialogConfig.height = "700px";
    dialogConfig.data = {
      id: 1,
      row:this.rows
    };
    const dialogRef = this.dialog.open(VisualDeckReportModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      console.log(data);
    })
  }
}
