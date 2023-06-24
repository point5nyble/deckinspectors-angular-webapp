import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-download-specific-report',
  templateUrl: './download-specific-report.component.html',
  styleUrls: ['./download-specific-report.component.scss']
})
export class DownloadSpecificReportComponent {
  @Input() title!: string;
}
