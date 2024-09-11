import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartService } from '../cart/cart.service';
import { getLocaleFirstDayOfWeek } from '@angular/common';
import { BookService } from '../book/book.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {

  constructor(private cartService:CartService, private bookService:BookService) { }
  query= new BehaviorSubject<string>('');
  currentQuery= this.query.asObservable();
  private loginState = new BehaviorSubject<boolean>(this.hasToken() && this.hasRole());

  loginState$ = this.loginState.asObservable();
  private adminState = new BehaviorSubject<boolean>(this.hasToken() && !this.hasRole());

  adminState$ = this.adminState.asObservable();
  
  private myWishList= new BehaviorSubject<any>([]);
  currentWishList= this.myWishList.asObservable();
  private myCartList= new BehaviorSubject<any>([]);
  currentCartList= this.myCartList.asObservable();
  private pvtbackEndList= new BehaviorSubject<any>([]);
  backEndList= this.pvtbackEndList.asObservable();
  private myOrderList= new BehaviorSubject<any>([]);
  currentOrderList= this.myOrderList.asObservable();
  private cartNumber= new BehaviorSubject<number>(0);
  currentCartNumber= this.cartNumber.asObservable();

  getSearchQuery(searchQuery: string) {
    this.query.next(searchQuery);
  }
  private hasToken(): boolean {
    return !!localStorage.getItem('access_token');
  }
  private hasRole(): boolean {
    return !(localStorage.getItem('role')=='admin');
  }
 getCartNumber(no:number){
    this.cartNumber.next(no);
  }
  login(): void {
    this.loginState.next(true);
  }

  logout(): void {
    this.loginState.next(false);
  }
  loginAdmin(): void {
    this.adminState.next(true);
  }

  logoutAdmin(): void {
    this.adminState.next(false);
  }
  updateWishList(data: any) {
    this.myWishList.next(data);
  }
  updateCartList(data: any) {
    console.log("-----------------------------------");
    
    console.log(data);
    
    this.myCartList.next(data);
  }
  updateBackendCartList(data: any) {
    this.pvtbackEndList.next(data);
  }
  updateOrderList(data: any) {
    this.myOrderList.next(data);
  }

  updateCartListWithLocal(alreadyAddedCartItems :any, data: any) {
    console.log("in update funciton");
    
    let t = localStorage.getItem('access_token');
 
    console.log(alreadyAddedCartItems);
    this.pvtbackEndList =data;
  if(t){
 
    if(alreadyAddedCartItems.length>0)
    {
      data.map((obj1 :any)=>
        alreadyAddedCartItems.some((obj2:any) => {
          if(obj1.product_id._id === obj2.product_id._id)
      { obj1.product_id.quantityToBuy=obj2.quantityToBuy;
 
     console.log(obj1);
     console.log(obj2);
     
     
 
        this.cartService.putCartDetails(obj1._id, {"quantityToBuy":obj2.quantityToBuy+obj1.quantityToBuy}).subscribe({
          next:(res)=>{
            console.log(res);
            console.log("Eres");
            this.cartService.getCartDetails().subscribe((res:any)=>{
              console.log("login end then");
                console.log(res.result);
                
         this.updateCartList(res.result);
   
        })
            
           
           
          }
        })
       
         
      }
      return obj2
 
        })
      );
 
    //   alreadyAddedCartItems.map((item:any)=>{
    //     this._userService.updateCartItemQnty(item.result._id, item.quantityToBuy).subscribe({
    //       next:(res)=>{
    //         console.log(res);
           
           
    //       }
    //     })
    // console.log(item);
   
       
       
    //   })
     
    }
    
    this.cartService.getCartDetails().subscribe((res:any)=>{
           console.log("login end then");
             console.log(res.result);
             
      this.updateCartList(res.result);

     })
   
   
  }
   
 
   
 
  }

  addBookToCartList(bookId:string,bookCarted:any,data:any){
    const cartList= this.myCartList.getValue();
    console.log(cartList);
    if(bookCarted.length==0){
    this.myCartList.next([...cartList, data]);

    console.log(this.myCartList.getValue());
    if(localStorage.getItem("access_token")){
      this.cartService.postCartDetails(bookId,{product_id:bookId}).subscribe({
        next:(res:any)=>{
          console.log(res);
        }
      })
    }
  }
      else{
        let result:any= bookCarted[0]._id;
        const cartList= this.myCartList.getValue();
        cartList.forEach((obj: any) => {
          if (obj.product_id._id === bookId) {
            obj.quantityToBuy = data.quantityToBuy;
            console.log(obj);
            
          }
        });
        this.myCartList.next(cartList);
        console.log(this.myCartList.getValue());
        if(localStorage.getItem("access_token")){
        this.cartService.putCartDetails(result,{quantityToBuy:data.quantityToBuy}).subscribe({
          next:(res)=>{
            console.log(res);     
          }
        })
        }
      }
    
    
  }

  updateQuantityOfBook(cart_id:string,data:any){
    const cartList= this.myCartList.getValue();
    this.myCartList.next(cartList.map((obj:any)=>{
      if(obj.product_id==cart_id)
        return {...obj,quantityToBuy:data.quantityToBuy}
      return obj
    }))
    console.log(this.myCartList.getValue());
    
    if(localStorage.getItem("access_token")){
      // this.cartService.getCartDetails().subscribe({
      //   next:(res:any)=>{
      //   singleCart=res.result.filter((obj:any)=> obj.product_id==cart_id)
      //   }
      // })
      this.cartService.putCartDetails(cart_id,data).subscribe({
        next:(res)=>{
          console.log(res);     
        }
      })
    }
  }
  addBookToWishList(data: any) {
    const wishList = this.myWishList.getValue();
    this.myCartList.next([...wishList, data]);
    console.log(this.myCartList.getValue());
    if (localStorage.getItem('access_token')) {
      this.bookService.postWislistItem(data.product_id, data).subscribe({
        next: (res) => {
          console.log(res);
        },
      });
    }
  }

  deletedFromWishList(id: string) {
    const wishList = this.myWishList.getValue();

    this.myCartList.next(wishList.filter((obj: any) => obj.product_id != id));
    console.log(this.myCartList.getValue());

    if (localStorage.getItem('access_token')) {
      this.bookService.deleteWishlistItem(id).subscribe({
        next: (res) => {
          console.log(res);
        },
      });
    }
  }

}
