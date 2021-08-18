import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'anibal-gallery',
  templateUrl: './gallery.component.html',
  styles: [
  ]
})
export class GalleryComponent implements OnInit {

  selectedImageUrl!: string;

  @Input() images!: string[] | undefined;

  ngOnInit(): void {
    if(this.images?.length) {
      this.selectedImageUrl = this.images[0];

    }
  }

  changeSelectedImage(imageUrl: string) {
    this.selectedImageUrl = imageUrl;
  }

  get hasImages() {
    if(this.images?.length) {
      return true
    } else {
      return false
    }
  }

  

}
