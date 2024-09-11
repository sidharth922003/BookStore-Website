import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-placed',
  templateUrl: './order-placed.component.html',
  styleUrls: ['./order-placed.component.scss']
})
export class OrderPlacedComponent implements OnInit {

  constructor(private renderer: Renderer2,private router:Router) { }

  ngOnInit(): void {
    // this.playGifOnce();
    console.log("done");
    
  }

  playGifOnce(): void {
    const element = document.querySelector('.order-placed-confetti-msg-cnt');
    if (element) {
      const gifUrl = '../../../assets/confettiBg.gif';
      this.renderer.setStyle(element, 'background-image', 'none'); // Reset the background image
      setTimeout(() => {
        this.renderer.setStyle(element, 'background-image', `url(${gifUrl}?t=${new Date().getTime()})`); // Add a timestamp to prevent caching
      }, 500);
    }
  }

  handleContinueShopping(){
    console.log("home");
    
    this.router.navigate(["/home/books"]);
  }

}
