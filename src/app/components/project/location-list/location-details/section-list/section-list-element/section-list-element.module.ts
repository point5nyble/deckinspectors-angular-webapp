import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionListElementComponent } from './section-list-element.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    SectionListElementComponent
  ],
  exports: [
    SectionListElementComponent
  ]
})
export class SectionListElementModule { }