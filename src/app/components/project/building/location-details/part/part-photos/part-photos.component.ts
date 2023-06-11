import { Component } from '@angular/core';

@Component({
  selector: 'app-part-photos',
  templateUrl: './part-photos.component.html',
  styleUrls: ['./part-photos.component.scss']
})
export class PartPhotosComponent {
  photos = [
    { url: '../../../../../../../assets/images/logo.jpg', caption: 'Photo 1' },
    { url: '../../../../../../../assets/images/logo.jpg', caption: 'Photo 2' },
    { url: '../../../../../../../assets/images/logo.jpg', caption: 'Photo 3' },
    { url: '../../../../../../../assets/images/logo.jpg', caption: 'Photo 1' },
    { url: '../../../../../../../assets/images/logo.jpg', caption: 'Photo 2' },
    { url: '../../../../../../../assets/images/logo.jpg', caption: 'Photo 3' }
  ];
}
