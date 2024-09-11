import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { DataService } from 'src/app/Services/data/data.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { CartComponent } from '../cart/cart.component';
import { CartService } from 'src/app/Services/cart/cart.service';
import { BookService } from 'src/app/Services/book/book.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {

  constructor(private dataService:DataService,private activeRoute:ActivatedRoute, private router:Router,public dialog:MatDialog,private cartService:CartService, private bookService:BookService) { 
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showDiv = !['/admin'].includes(event.urlAfterRedirects);
      }
    });
  }
  searchQuery="";
  showDiv =false;
  isLogin=false;
  access_token = localStorage.getItem('access_token');
  isAdmin:boolean=false;
  wishList:any[]=[];
  currRoute!:string;
  cartNo:number=0;
  
  ngOnInit(): void {
    const currentRoute = this.router.url;
    this.showDiv = !['/admin'].includes(currentRoute);
    this.dataService.loginState$.subscribe(isAuthenticated => {
      this.isLogin = isAuthenticated;
    });
    this.activeRoute.url.subscribe(urlSegment => {

      this.currRoute=this.router.url
        
     
        });
        let locallist:any;
      this.dataService.currentCartList.subscribe((res)=>{
       locallist = res;
       this.cartNo=res.length;

     })
     console.log(locallist);
  this.dataService.currentCartNumber.subscribe({
    next:(res)=>{
      this.cartNo=res;
    }
  })
    if(this.access_token){

     this.cartService.getCartDetails().subscribe({
      next: (res: any) => {
       
        this.dataService.updateBackendCartList(res.result);
        console.log("comparing");
        
     let check=  this.compare(locallist, res.result);
     if(!check)
    {
      this.dataService.updateCartList(res.result)
    }
  }
});
   
   
     
   
    
    
    this.bookService.getWishlistItem().subscribe({
      next:(res:any)=>{
        console.log("header book sub",res);
        this.dataService.updateWishList(res.result);
      }
    });
  }
  
  
  }

  setSearchQuery(){
    this.dataService.getSearchQuery(this.searchQuery);
  }

  handleCart(){
    console.log("cart");
    this.router.navigate(["/home/cart"]);
    
  }
  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.height = '90vh'; 
    dialogConfig.width = '100vw'; 
    dialogConfig.enterAnimationDuration = enterAnimationDuration;
    dialogConfig.exitAnimationDuration = exitAnimationDuration;
    this.dialog.open(LoginComponent,dialogConfig);

  }
  updateWishList(){
    this.bookService.getWishlistItem().subscribe({
      next:(res:any)=>{
        this.wishList.push(res)
      }
    })
  }


  navigateToBookList(){
    this.router.navigate(['home/books'])
  }

  handleLogOut(){
    localStorage.clear();
    this.router.navigate(['home/books']);
    this.dataService.logout();  
    this.dataService.updateCartList([]); 
    this.dataService.updateWishList([]);
  }
  navigateToWishList(){
    this.router.navigate(['/home/wishlist'])
  }
  navigateToProfile(){
    this.router.navigate(['/home/profile'])

  }
  navigateToOrderList(){
    this.router.navigate(['/home/order-list'])

  }
  navigateToCart(){
    this.router.navigate(['/home/cart'])

  }
  navigateToAdmin(){
    this.router.navigate(['/admin']);

  }
  compare(local:any[], backend:any[]):Boolean{
  
 
   
 
 
 
    const notaddedincart = local.filter(obj1 =>
      backend.some(obj2 => obj1.product_id._id !== obj2.product_id._id)
    );
 
    const alreadyAddedInCart = local.filter(obj1 =>
      backend.some(obj2 => obj1.product_id._id === obj2.product_id._id)
    );
 
    console.log(notaddedincart);
    console.log(alreadyAddedInCart);
    notaddedincart.map((item)=>{

      this.cartService.postCartDetails(item.product_id._id,{product_id:item.product_id._id}).subscribe({
        next:(res:any)=>{
          console.log(res);
          this.cartService.putCartDetails(res.result._id,{"quantityToBuy":item.quantityToBuy}).subscribe({
            next:(res)=>{
            
              console.log("in compare");
      
              console.log(item);
            
    
           
              console.log("login end ");
           
              this.dataService.updateCartListWithLocal(alreadyAddedInCart, backend);
                return true
               
            }
          })
          // this._userService.updateCartItemQnty(res.result._id, item.quantityToBuy).subscribe({
          //   next:(res)=>{
          //     console.log(res);
             
             
          //   }
          // })
        }
      })
    
     
 
     
     
    })

  

    return false;
  }
}
 
