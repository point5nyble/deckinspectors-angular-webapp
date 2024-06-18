import { Injectable } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { Question } from '../common/models/question';

@Injectable({
    providedIn: 'root'
})
export class QuestionControlService {
    constructor(private fb: FormBuilder) { }

    toFormGroup(questions: Question[]) {
        const group: any = {};

        questions.forEach(question => {
            if (question.type === 'text') {
                group[question.label] = this.fb.control('');
            } else {
                group[question.label] = this.fb.array(this.createOptionsControls(question.options!));
            }
        });

        return this.fb.group(group);
    }

    createOptionsControls(options: string[]) {
        return options.map(option => this.fb.control(option));
    }
}
