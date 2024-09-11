import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.scss'],
})
export class BookCardComponent implements OnInit {

  images: string[] = [
   '../../../assets/book1.png',
   '../../../assets/book2.png',
   '../../../assets/book3.png',
   '../../../assets/book4.png',
   '../../../assets/book5.png',
   '../../../assets/book6.png',
   '../../../assets/book7.png',
   '../../../assets/book8.png',
   '../../../assets/book9.png'
  ];



  selectedImages: string[] = [];

  imageSrc: string = '';

  @Input() book: any;
  @Input() randomImg : any;

  randomBookImg: any;
  currentRoute!: string;
  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.activatedRoute.url.subscribe((urlSegment) => {
      this.currentRoute = urlSegment.join('/');
    });
  }

  clickingOnParticularCard() {
    if (this.currentRoute != 'admin')
      this.router.navigate([`home/books/_id=${this.book._id}`], {
        queryParams: { id: this.book._id },
      });
  }

  showImage(imageId: string) {
    this.imageSrc = imageId;
  }

  showRandomImages(count: number) {
    const shuffled = this.images.sort(() => 0.5 - Math.random());
    this.selectedImages = shuffled.slice(0, count);
  }

  getRandomImg(){
    console.log("Random Images",this.images[Math.floor(Math.random() * this.images.length)]);
    return this.images[Math.floor(Math.random() * this.images.length)];
  }
}
