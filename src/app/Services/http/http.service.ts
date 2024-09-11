import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class HttpService {

  BASE_URL = "https://bookstore.incubation.bridgelabz.com/"


  token:any=localStorage.getItem('access_token');

  headers= new HttpHeaders({
    "x-access-token":this.token,
  })

  constructor(private http:HttpClient) { }


  postAPIcall(endPoint: string, payload:any,headerss:any=null) {
    let token = localStorage.getItem('access_token');
 
    let headers = new HttpHeaders({
      'x-access-token': token || '',
    });
    return this.http.post(this.BASE_URL + endPoint,payload,{headers});
  }

  getAPIcall(endPoint?:string,header:any=null){
    return this.http.get(this.BASE_URL + endPoint,header);
  }
  putAPIcall(endPoint:string,payload:any,headerss:any=null){
    let token = localStorage.getItem('access_token');
 
    let headers = new HttpHeaders({
      'x-access-token': token || '',
    });
    return this.http.put(this.BASE_URL + endPoint,payload,{headers})
  }

  deleteAPIcall(endPoint:string,headers:any=null){
    return this.http.delete(this.BASE_URL + endPoint,{headers});
  }
}
