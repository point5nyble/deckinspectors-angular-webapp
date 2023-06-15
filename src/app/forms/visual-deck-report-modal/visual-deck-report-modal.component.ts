import { Component } from '@angular/core';

@Component({
  selector: 'app-visual-deck-report-modal',
  templateUrl: './visual-deck-report-modal.component.html',
  styleUrls: ['./visual-deck-report-modal.component.scss']
})
export class VisualDeckReportModalComponent {
  exteriorElementsOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
    // Add more options as needed
  ];
}
