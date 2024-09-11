import { Injectable, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { LOCATION_ICON } from 'src/assets/svg-icons';
import { HttpService } from '../http/http.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService implements OnInit {

  constructor(private http:HttpService){}

  ngOnInit(): void {
       
  }
  token:any=localStorage.getItem('access_token');

  headers= new HttpHeaders({
    "x-access-token":this.token,
  })

  getCartDetails(){
   let token=localStorage.getItem('access_token')|| '';

    let headerss= new HttpHeaders({
      "x-access-token":token,
    })
    return this.http.getAPIcall("bookstore_user/get_cart_items",{headers:headerss});
  } 

  changeCartItemsQty(id:any,payload:any){
    return this.http.putAPIcall(`bookstore_user/cart_item_quantity/${id}`,payload)
  }
   
  postCartDetails(id:string,data:any){
    return this.http.postAPIcall(`bookstore_user/add_cart_item/${id}`,data,this.headers);
  }
  
  putCartDetails(id:string, data:any){
    return this.http.putAPIcall(`bookstore_user/cart_item_quantity/${id}`,data,this.headers);
  }

  removeCartItem(id:string){
    return this.http.deleteAPIcall(`bookstore_user/remove_cart_item/${id}`,this.headers)
  }

  updateCustomerAddress(data:any){
    return this.http.putAPIcall("bookstore_user/edit_user", data);
  }

  addToOrder(data:any){
    return this.http.postAPIcall('bookstore_user/add/order', data,this.headers);
  }
}

