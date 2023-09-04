import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-download-specific-report',
  templateUrl: './download-specific-report.component.html',
  styleUrls: ['./download-specific-report.component.scss']
})
export class DownloadSpecificReportComponent {
  @Input() title!: string;
  @Output() downloadReportEvent = new EventEmitter<any>();
  @Input() showLoading!: boolean;

  downloadReport(reportFormat: string) {
    this.downloadReportEvent.emit({title: this.title, reportFormat: reportFormat});
  }
}
