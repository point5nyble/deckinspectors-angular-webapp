import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-download-specific-report',
  templateUrl: './download-specific-report.component.html',
  styleUrls: ['./download-specific-report.component.scss']
})
export class DownloadSpecificReportComponent {
  @Input() title!: string;
  @Output() downloadReportEvent = new EventEmitter<string>();

  downloadReport() {
    this.downloadReportEvent.emit(this.title)
  }
}
