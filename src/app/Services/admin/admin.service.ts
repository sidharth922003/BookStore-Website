import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private httpService:HttpService){}
  private addedBookPvt= new BehaviorSubject<any>({});
  addedBook= this.addedBookPvt.asObservable();

  adminLoginApiCall(data:any){
    return this.httpService.postAPIcall("bookstore_user/admin/login",data);
  }
  adminRegisterApiCall(data:any){
    return this.httpService.postAPIcall("bookstore_user/admin/registration",data);
  }
  addBookApiCall(data:any){
    return this.httpService.postAPIcall("bookstore_user/admin/add/book",data);
  }


  bookAdded(data:any){


    this.addedBookPvt.next(data);

  }

  
}
