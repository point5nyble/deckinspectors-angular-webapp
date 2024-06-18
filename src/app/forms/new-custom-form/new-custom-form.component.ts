import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Question } from 'src/app/common/models/question';
import { QuestionControlService } from 'src/app/service/question-control.service';

@Component({
  selector: 'app-new-custom-form',
  templateUrl: './new-custom-form.component.html',
  styleUrls: ['./new-custom-form.component.scss']
})
export class NewCustomFormComponent {
  questions: Question[] = [];
  form!: FormGroup;
  isSaving: boolean = false;
  formName: string = '';

  constructor(private fb: FormBuilder, private qcs: QuestionControlService,
    private dialogRef: MatDialogRef<NewCustomFormComponent>) {}

  ngOnInit() {
    this.form = this.fb.group({});
    this.addQuestion(0);
  }

  addQuestion(index: number) {
    console.log("adding")
    const newQuestion: Question = { type: 'text', label: 'New Question', options: ['Option 1'] };
    this.questions.splice(index + 1, 0, newQuestion);
    this.updateFormType();
  }

  deleteQuestion(index: number) {
    this.questions.splice(index, 1);
    this.updateFormType();
  }
  

  updateFormType(){
    this.form = this.qcs.toFormGroup(this.questions);
  }

  save() {
    console.log(this.questions);
  }

  close() {
    this.dialogRef.close();
  }
}
