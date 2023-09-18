import {Component, Input, OnInit} from '@angular/core';
import {InspectionReport} from "../../../../../../common/models/inspection-report";

@Component({
  selector: 'app-section-photos',
  templateUrl: './section-photos.component.html',
  styleUrls: ['./section-photos.component.scss']
})
export class SectionPhotosComponent implements OnInit{
  @Input() images!: string[];

  previewImage = false;
  showMask = false;
  currentLightboxImage = '';
  currentIndex = 0;

  ngOnInit(): void {
  }

  openPreviewImage(index: number): void {
    console.log("Index is"+index);
    this.previewImage = true;
    this.currentIndex = index;
    this.currentLightboxImage = this.images[index];
  }

  closeImagePreview(): void {
    this.previewImage = false;
  }

  prev(): void {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.currentLightboxImage = this.images[this.currentIndex];
  }

  next(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.currentLightboxImage = this.images[this.currentIndex];
  }
}
