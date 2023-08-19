import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationListElementComponent } from './location-list-element.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    LocationListElementComponent
  ],
  exports: [
    LocationListElementComponent
  ]
})
export class LocationListElementModule { }