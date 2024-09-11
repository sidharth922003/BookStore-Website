import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private httpService:HttpService){}

  UserLoginApiCall(data:any){
    return this.httpService.postAPIcall("bookstore_user/login",data);
  }

  UserRegisterApiCall(data:any){
    return this.httpService.postAPIcall("bookstore_user/registration",data);
  }

  updateProfileAddress(data: any){
    return this.httpService.putAPIcall(`bookstore_user/edit_user`,data)
  }

  getProfile() {
    return this.httpService.getAPIcall("bookstore_user/get_user_profile");
  }
}

