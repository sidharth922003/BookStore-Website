import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpService } from '../http/http.service';
import { Token } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})

export class BookService {
  BASE_URL = "https://bookstore.incubation.bridgelabz.com/"
  endPoint = "bookstore_user/get/book";

  token:any=localStorage.getItem('access_token');

  headers= new HttpHeaders({
    "x-access-token":this.token,
  })

  constructor(private http: HttpClient,private httpService:HttpService) {}

  getAllBooks() {
    console.log("URL",this.BASE_URL+this.endPoint);
    return this.http.get(this.BASE_URL+this.endPoint);
  }

  getBookDescription(id:string){
    return this.httpService.getAPIcall(`bookstore_user/get/book?_id=${id}`)
  }

  getBookFeedback(id:string){
    return this.httpService.getAPIcall(`bookstore_user/get/feedback/${id}`,{headers:this.headers});
  }
   postBookFeedback(id:string,data:any){
    return this.httpService.postAPIcall(`bookstore_user/add/feedback/${id}`,data,{headers:this.headers})
   }

   getWishlistItem(){
    let    token=localStorage.getItem('access_token')|| '';
    let headerss= new HttpHeaders({
      "x-access-token":token,
    })    
    return this.httpService.getAPIcall("bookstore_user/get_wishlist_items",{headers:headerss});
   }

   postWislistItem(id:string,data:any){
    return this.httpService.postAPIcall(`bookstore_user/add_wish_list/${id}`,data,this.headers);
   }

   deleteWishlistItem(id:string){
    return this.httpService.deleteAPIcall(`bookstore_user/remove_wishlist_item/${id}`,this.headers)
   }

   
}
