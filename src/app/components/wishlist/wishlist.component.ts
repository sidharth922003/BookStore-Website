import { DataService } from 'src/app/Services/data/data.service';
import { Component, OnInit } from '@angular/core';
import { BookService } from 'src/app/Services/book/book.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {

  allWishListedItem: any[] = [];
  

  constructor(private bookService: BookService, private dataService: DataService) { }

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.bookService.getWishlistItem().subscribe({
      next: (res: any) => {
        console.log("wishlist data", res);
        this.allWishListedItem = [];
        const filteredData = res.result.filter((item: any) => item.product_id !== null);
        console.log(filteredData);

        for (let item of filteredData) {
          const product = item.product_id || {};
          this.allWishListedItem.push(product);
        }
        console.log("allWishListedItem, ", this.allWishListedItem);
        this.dataService.updateWishList(this.allWishListedItem); // Update the wishlist in DataService
      },
      error: (err) => {
        console.log("Error", err);
      }
    });
  }

  deleteBook(book: any) {
    console.log(book,"book");
    this.bookService.deleteWishlistItem(book?._id).subscribe({
      next:(res:any) => {
        console.log("deleted product", res);
        // alert  ((res as any).message);
        this.loadWishlist(); // Reload the wishlist after deletion
      },
       

      error: (err) =>{
        console.log("Eror", err);
      }
    });
  }
}
 