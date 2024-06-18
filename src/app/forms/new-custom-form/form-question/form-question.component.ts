import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Question } from '../../../common/models/question';

@Component({
  selector: 'app-form-question',
  templateUrl: './form-question.component.html',
  styleUrls: ['./form-question.component.scss']
})
export class FormQuestionComponent {
  @Input() question!: Question;
  @Input() form!: FormGroup;
  @Output() addQuestion: EventEmitter<void> = new EventEmitter<void>();
  @Output() updateType: EventEmitter<void> = new EventEmitter<void>();

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    if (this.question.type !== 'text') {
      const control = this.form.get(this.question.label) as FormArray;
      if (!control) {
        this.form.addControl(this.question.label, this.fb.array(this.createOptionsControls(this.question.options!)));
      }
    } else {
      this.form.addControl(this.question.label, this.fb.control(''));
    }
  }

  createOptionsControls(options: string[]) {
    return options.map(option => this.fb.control(option));
  }

  get isValid() {
    return this.form.controls[this.question.label]?.valid;
  }

  get formArray() {
    return this.form.get(this.question.label) as FormArray;
  }

  raiseAddQuestionEvent(){
    this.addQuestion.emit();
  }

  updateFormType(){
    this.updateType.emit();
  }

  addOption() {
    const control = this.form.get(this.question.label) as FormArray;
    control.push(this.fb.control(''));
    this.question.options!.push(`Option ${this.question.options!.length + 1}`);
  }

  deleteOption(index: number) {
    const control = this.form.get(this.question.label) as FormArray;
    control.removeAt(index);
    this.question.options!.splice(index, 1);
  }
}
