import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-info',
  templateUrl: './section-info.component.html',
  styleUrls: ['./section-info.component.scss'],
})
export class SectionInfoComponent {
  @Input() rows: { column1: string; column2: any }[] = [];
  @Input() isDynamicForm: boolean = false;
  @Input() formQuestions: any[] = [];
  @Input() isSaving: boolean = false;
  constructor() {}

  getFormattedColumn2Value(column2Value: any): string {
    // console.log(column2Value);
    if (
      column2Value === true ||
      column2Value === 'True' ||
      column2Value === 'true'
    ) {
      return 'Yes';
    } else if (
      column2Value === false ||
      column2Value === 'False' ||
      column2Value === 'false'
    ) {
      return 'No';
    } else if (column2Value === 'Futureinspection') {
      return 'Future Inspection';
    } else if (
      column2Value === undefined ||
      column2Value === null ||
      column2Value === ''
    ) {
      return 'None';
    } else {
      return column2Value.toString(); // Use toString() or apply additional formatting if needed
    }
  }

  getBackgroundColorLyf(column2Value: string): string {
    // Add logic to determine the color based on column2Value
    if (column2Value === '7+ Years') {
      return '#70df8a';
    } else if (column2Value === '0-1 Years') {
      return '#ee7d7d';
    } else if (column2Value === '1-4 Years') {
      return '#f0c265';
    } else if (column2Value === '4-7 Years') {
      return '#f7f368';
    } else {
      // Return a default color or handle other cases
      return 'transparent';
    }
  }

  getBackgroundColorElement(column2Value: string): string {
    // Add logic to determine the color based on column2Value
    if (column2Value === 'Good') {
      return '#70df8a';
    } else if (column2Value === 'Bad') {
      return '#ee7d7d';
    } else if (column2Value === 'Fair') {
      return '#f7f368';
    } else {
      // Return a default color or handle other cases
      return 'transparent';
    }
  }

  getBackgroundColorBool(column1Value: any, column2Value: any): string {
    // Add logic to determine the color based on column2Value
    if (column1Value === 'Unit Unavailable') {
      return '#70df8a';
    } else if (
      column1Value === 'Visual Signs of Leak' &&
      (column2Value === true ||
        column2Value === 'True' ||
        column2Value === 'true' ||
        column2Value == 'Pass' ||
        column2Value == 'Yes' ||
        column2Value == 'yes')
    ) {
      return '#ee7d7d';
    } else if (
      column1Value === 'Visual Signs of Leak' &&
      (column2Value === false ||
        column2Value === 'False' ||
        column2Value === 'false' ||
        column2Value === 'Fail' ||
        column2Value == 'No' ||
        column2Value == 'no')
    ) {
      return '#70df8a';
    } else if (
      column1Value === 'Further Invasive Review Required' &&
      (column2Value === true ||
        column2Value === 'True' ||
        column2Value === 'true' ||
        column2Value == 'Pass' ||
        column2Value == 'Yes' ||
        column2Value == 'yes')
    ) {
      return '#ee7d7d';
    } else if (
      column1Value === 'Further Invasive Review Required' &&
      (column2Value === false ||
        column2Value === 'False' ||
        column2Value === 'false' ||
        column2Value === 'Fail' ||
        column2Value == 'No' ||
        column2Value == 'no')
    ) {
      return '#70df8a';
    } else if (
      column1Value === 'Post Invasive Repairs Required' &&
      (column2Value === true ||
        column2Value === 'True' ||
        column2Value === 'true' ||
        column2Value == 'Pass' ||
        column2Value == 'Yes' ||
        column2Value == 'yes')
    ) {
      return '#ee7d7d';
    } else if (
      column1Value === 'Post Invasive Repairs Required' &&
      (column2Value === false ||
        column2Value === 'False' ||
        column2Value === 'false' ||
        column2Value === 'Fail' ||
        column2Value == 'No' ||
        column2Value == 'no')
    ) {
      return '#70df8a';
    } else if (
      column2Value === true ||
      column2Value === 'True' ||
      column2Value === 'true' ||
      column2Value == 'Pass' ||
      column2Value == 'Yes' ||
      column2Value == 'yes'
    ) {
      return '#70df8a';
    } else if (
      column2Value === false ||
      column2Value === 'False' ||
      column2Value === 'false' ||
      column2Value === 'Fail' ||
      column2Value == 'No' ||
      column2Value == 'no'
    ) {
      return '#ee7d7d';
    } else if (
      column2Value === 'Futureinspection' ||
      column2Value === 'Future Inspection'
    ) {
      return '#f0c265';
    } else {
      // Return a default color or handle other cases
      return 'transparent';
    }
  }
}
