import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { BookService } from 'src/app/Services/book/book.service';
import { DataService } from 'src/app/Services/data/data.service';
import { Router } from '@angular/router';
import { CartService } from 'src/app/Services/cart/cart.service';

@Component({
  selector: 'app-book-description',
  templateUrl: './book-description.component.html',
  styleUrls: ['./book-description.component.scss']
})


export class BookDescriptionComponent implements OnInit {
  private ngUnsubscribe = new Subject<void>();
  bookId: string= "";
  book:any={};
  feedback:any=[];
  displayRating=0;
  maxStars = 5;
  rating = 0;
  review:string="";
  stars: boolean[] = [];
  recievedStars:boolean[]=[];
  isAddedToBag = false;
  quantity = 1;
  isInWishlist: boolean=false;
  cartList:any[]=[];
  currentQuantity:number=0;
  bookCarted:any;
  images:string[]=["https://public-v2links.adobecc.com/d096df37-ca37-4026-553f-8cfa6bec09ec/component?params=component_id%3A115f0025-d8bf-436a-a7c3-030a8a1de757&params=version%3A0&token=1725289454_da39a3ee_db75758dc59b3b19f7e83df367a75711744ee25d&api_key=CometServer1",
    "https://public-v2links.adobecc.com/d096df37-ca37-4026-553f-8cfa6bec09ec/component?params=component_id%3Adbd4f4a0-20d3-48b1-ae13-926e5ed7f1fb&params=version%3A0&token=1725289454_da39a3ee_db75758dc59b3b19f7e83df367a75711744ee25d&api_key=CometServer1",
    "https://public-v2links.adobecc.com/d096df37-ca37-4026-553f-8cfa6bec09ec/component?params=component_id%3A4d3e5003-ec75-4fad-93b9-85471f8aae0c&params=version%3A0&token=1725289454_da39a3ee_db75758dc59b3b19f7e83df367a75711744ee25d&api_key=CometServer1",
    "https://public-v2links.adobecc.com/d096df37-ca37-4026-553f-8cfa6bec09ec/component?params=component_id%3Ae8047196-2172-4313-af0e-60107356f41a&params=version%3A0&token=1725289454_da39a3ee_db75758dc59b3b19f7e83df367a75711744ee25d&api_key=CometServer1",
    "https://public-v2links.adobecc.com/d096df37-ca37-4026-553f-8cfa6bec09ec/component?params=component_id%3Ae84da527-117a-4f3e-9633-29f14754ffb9&params=version%3A0&token=1725289454_da39a3ee_db75758dc59b3b19f7e83df367a75711744ee25d&api_key=CometServer1",
    "https://public-v2links.adobecc.com/d096df37-ca37-4026-553f-8cfa6bec09ec/component?params=component_id%3A29fe0f12-8872-4e38-b7b8-ae97b115d640&params=version%3A0&token=1725289454_da39a3ee_db75758dc59b3b19f7e83df367a75711744ee25d&api_key=CometServer1",
    "https://public-v2links.adobecc.com/d096df37-ca37-4026-553f-8cfa6bec09ec/component?params=component_id%3A9c50db3c-a21e-47be-80d2-297e90b311bb&params=version%3A0&token=1725289454_da39a3ee_db75758dc59b3b19f7e83df367a75711744ee25d&api_key=CometServer1",
    "https://public-v2links.adobecc.com/d096df37-ca37-4026-553f-8cfa6bec09ec/component?params=component_id%3A6cc89ddf-9bcc-4b3f-8531-c772a71d4c71&params=version%3A0&token=1725289454_da39a3ee_db75758dc59b3b19f7e83df367a75711744ee25d&api_key=CometServer1",
    "https://public-v2links.adobecc.com/d096df37-ca37-4026-553f-8cfa6bec09ec/component?params=component_id%3A620bca87-76db-497a-add2-ccd7126eec6b&params=version%3A0&token=1725289454_da39a3ee_db75758dc59b3b19f7e83df367a75711744ee25d&api_key=CometServer1"
  ];
  selectedImages:string[]=[];
  imageSrc:string="";

  constructor(private activeRoute: ActivatedRoute,private bookService:BookService, private dataService:DataService,private router:Router, private cartService:CartService) {}
 
  ngOnInit(): void {
    this.showRandomImages(2); 
    this.imageSrc=this.selectedImages[0];
    this.displayRating=this.generateRandomRating();
    this.activeRoute.queryParams
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(params => {
        this.bookId = params['id'];
        console.log(this.bookId); 
    });

    this.bookService.getAllBooks().subscribe({
      next:(res:any)=>{
        this.book=res.result.filter((obj:any)=>obj._id==this.bookId);
        console.log(this.book);
        
      } 
    });


    this.bookService.getBookFeedback(this.bookId).subscribe({
      next:(res:any)=>{
        this.feedback= res.result;
        console.log(res.result);
        this.recievedStars = Array(5).fill(false).map((_, index) => index < this.feedback.rating);
        
      }
    });

    this.stars = Array(this.maxStars).fill(false);
    this.updateStars();
    
    this.dataService.currentCartList.subscribe({
      next:(res)=>{
        console.log(res);
        let data= res.filter((obj:any)=>obj.product_id._id==this.bookId)
        this.currentQuantity=data[0].quantityToBuy;
        console.log("Quantity",this.currentQuantity);
      }
    });
  
    this.dataService.currentWishList.subscribe({
      next:(res)=>{
        console.log("WishLsit",res);
        let data= res.filter((obj:any)=>obj.product_id._id==this.bookId)
        if(data.length!=0)
          this.isInWishlist=true;
        
      }
    });
  
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


  setCartNumber(){
    this.dataService.currentCartList.subscribe({
      next:(res)=>{
        this.dataService.getCartNumber(res.length)      }
    })
  }

  updateStars() {
    for (let i = 0; i < this.maxStars; i++) {
      this.stars[i] = i < this.rating;
    }
  }
  getStars(rating: number): boolean[] {
    return Array(5).fill(false).map((_, index) => index < rating);
  }
  rate(index: number) {
    if (this.rating === index + 1) {
      this.rating = index;
    } else {
      this.rating = index + 1;
    }
    this.updateStars();
  }
   handleAddNewReview(){
     this.bookService.postBookFeedback(this.bookId,{"comment":this.review,"rating":this.rating}).subscribe({
      next:(res)=>{
        console.log(res);
        
      }
     });
     const obj= {
      comment :this.review,
      rating: this.rating,
      user_id:{
        fullName:"Harpreet"
      }
     }
     this.feedback=[obj,...this.feedback]
     this.review="";
     this.rate(-1);
   }
  

   sendCartListData(buttonType:string){
    buttonType=="plus"?this.currentQuantity++:this.currentQuantity--;
    
    this.dataService.currentCartList.subscribe({
      next:(res)=>{
        this.cartList=res;
        console.log(this.cartList);     
      }
    })
   this.bookCarted=this.cartList.filter((obj)=>obj.product_id._id==this.bookId)
      console.log(this.bookCarted);
      
    const cart={
      "product_id":{
        "author"
        : this.book[0].author
        ,
        "bookName"
        : 
        this.book[0].bookName,

        "description"
        : 
        this.book[0].description,
        "discountPrice"
        : 
        this.book[0].discountPrice,
        "price"
        : 
        this.book[0].price,
        "_id":this.bookId

      },
      "quantityToBuy": this.currentQuantity
    }
    // console.log(cart.product_id._id);
    console.log("dataaaaa:",this.bookCarted,cart);
    
    this.dataService.addBookToCartList(this.bookId,this.bookCarted,cart);
 
   }

   sendDataToWishlist(){
    if(!localStorage.getItem("access_token")){
      this.router.navigate(['home/wishlist/please-login']);
      return;
    }
    this.isInWishlist=true;
    const wish={
      "product_id": this.bookId
    }
    this.dataService.addBookToWishList(wish);
   }

   deleteDataFromWishList(){
    this.isInWishlist=false;
    this.dataService.deletedFromWishList(this.bookId);
   }
   navigateToBookList(){
    this.router.navigate(['home/books'])
  }

  showImage(imageId: string) {
      this.imageSrc = imageId;
  }
  showRandomImages(count: number) {
    const shuffled = this.images.sort(() => 0.5 - Math.random());
    this.selectedImages = shuffled.slice(0, count);
  }
   generateRandomRating(): number {
    const rating = (Math.random() * 4) + 1; 
    return Math.round(rating * 10) / 10
  }
}
