import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/Services/user/user.service';
import { MatTabGroup } from '@angular/material/tabs';
import { AdminService } from 'src/app/Services/admin/admin.service';
import { CartService } from 'src/app/Services/cart/cart.service';
import { BookService } from 'src/app/Services/book/book.service';
import { DataService } from 'src/app/Services/data/data.service';
import { MatDialogRef } from '@angular/material/dialog';
import { dematerialize } from 'rxjs';
import { isAccessTokenPresent } from 'src/utils/utils';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

interface CartDetailsResponse {
  result: any; // Replace 'any' with the actual type if known
}

interface BackendCartResponse {
  result: any; // Replace 'any' with the actual type if known
}

interface Product {
  description: string;
  discountPrice: number;
  bookImage: string | null;
  _id: string;
  admin_user_id: string;
  bookName: string;
  author: string;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface CartItem {
  product_id: Product;
  quantityToBuy: number;
  _id?: string;
  user_id?: {
    address: Array<{
      addressType: string;
      fullAddress: string;
      city: string;
      state: string;
    }>;
    isVerified: boolean;
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  allCartItems: any;
  allWishlistItems: any;
  hide_signUp = true;
  hide_login = true;
  currRoute!: string;
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;

  userFullName: string = '';
  userPhoneNumber: string = '';

  hide = true;
  isLoginVisible: boolean = true;

  dataServiceCartList: any[] = [];
  backendCartList: any[] = [];
  dataServiceWishList: any[] = [];

  constructor(
    private cartService: CartService,
    private activeRoute: ActivatedRoute,
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private adminService: AdminService,
    private cartservice: CartService,
    private bookService: BookService,
    private dialogRef: MatDialogRef<LoginComponent>,
    private http: HttpClient
  ) {}


   BackendCartList: any[] = [];
  DataServiceCartList: any[] = []

  ngOnInit(): void {
    this.activeRoute.url.subscribe((urlSegment) => {
      this.currRoute = this.router.url;
    });
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.registerForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', Validators.required],
    });

    this.cartservice.getCartDetails().subscribe({
      next: (res: any) => {
        console.log(res);
        this.dataService.updateCartList(res.result);
        localStorage.setItem('fname', res[0].user_id.fullName);
        localStorage.setItem('phone', res[0].user_id.phone);
      },
    });

    this.bookService.getWishlistItem().subscribe({
      next: (res: any) => {
        console.log(res);
        this.dataService.updateWishList(res.result);
      },
    });
  }

  showLogin() {
    this.isLoginVisible = true;
  }

  showSignup() {
    this.isLoginVisible = false;
  }

  get loginControl() {
    return this.loginForm.controls;
  }
  login() {
    if (this.currRoute == '/admin') {
      this.adminLogin();
    } else {
      this.userLogin();
    }
  }

  compare(local: any[], backend: any[]): Boolean {
    const notaddedincart = local.filter((obj1) =>
      backend.some((obj2) => obj1.product_id._id !== obj2.product_id._id)
    );

    const alreadyAddedInCart = local.filter((obj1) =>
      backend.some((obj2) => obj1.product_id._id === obj2.product_id._id)
    );

    console.log(notaddedincart);
    console.log(alreadyAddedInCart);
    notaddedincart.map((item) => {
      this.cartService
        .postCartDetails(item.product_id._id, {
          product_id: item.product_id._id,
        })
        .subscribe({
          next: (res: any) => {
            console.log(res);
            this.cartService
              .putCartDetails(res.result._id, {
                quantityToBuy: item.quantityToBuy,
              })
              .subscribe({
                next: (res) => {
                  console.log('in compare');

                  console.log(item);

                  console.log('login end ');

                  this.dataService.updateCartListWithLocal(
                    alreadyAddedInCart,
                    backend
                  );
                  return true;
                },
              });
            // this._userService.updateCartItemQnty(res.result._id, item.quantityToBuy).subscribe({
            //   next:(res)=>{
            //     console.log(res);

            //   }
            // })
          },
        });
    });

    return false;
  }

  userLogin() {
    if (this.loginForm.invalid) return;
    const { email, password } = this.loginForm.value;
    console.log(email, password);

    this.userService.UserLoginApiCall({ email, password }).subscribe({
      next: (res: any) => {


        console.log('response', res);
        localStorage.setItem('access_token', res.result.accessToken);

        if(localStorage.getItem("access_token")){
          this.cartFinalization();
        }


        localStorage.setItem('role', 'user');
        this.dataService.login();
        let locallist: any;
        this.dataService.currentCartList.subscribe((res) => {
          locallist = res;
        });
        console.log(locallist);

        //GET API CALLS
        if (res.result.accessToken) {
          this.cartservice.getCartDetails().subscribe({
            next: (res: any) => {
              this.dataService.updateBackendCartList(res.result);
              console.log('comparing');

              // let check = this.compare(locallist, res.result);
              // if (!check) {
              //   this.dataService.updateCartList(res.result);
              // }
            },
          });

          this.bookService.getWishlistItem().subscribe({
            next: (res: any) => {
              console.log(res);
              this.dataService.updateWishList(res.result);
            },
          });
        }
        this.dialogRef.close();
        this.router.navigate(['./home/books']);
      },
      error: (err) => {
        console.log('error:', err);
      },
    });
  }

  get registerControl() {
    return this.registerForm.controls;
  }
  togglePasswordVisibilitysignUp(): void {
    this.hide_signUp = !this.hide_signUp;
  }
  togglePasswordVisibilitylogin(): void {
    this.hide_login = !this.hide_login;
  }

  userRegister() {
    if (this.registerForm.invalid) {
      console.log(this.registerForm.invalid);
      return;
    }

    const { fullName, email, password, phone } = this.registerForm.value;

    let register = {
      fullName: fullName,
      email: email,
      password: password,
      phone: phone,
    };

    console.log(register);

    this.userService.UserRegisterApiCall(register).subscribe({
      next: (res) => {
        console.log('response:', res);
        this.tabGroup.selectedIndex = 0;
      },
      error: (err) => {
        console.log('error:', err);
      },
    });
  }

  adminLogin() {
    localStorage.setItem('role', 'admin');
    if (this.loginForm.invalid) return;
    const { email, password } = this.loginForm.value;
    console.log(email, password);

    this.adminService.adminLoginApiCall({ email, password }).subscribe({
      next: (res: any) => {
        console.log('response', res);
        localStorage.setItem('access_token', res.result.accessToken);
        console.log('access_token', res.result.accessToken);
        this.dataService.loginAdmin();

        // this.router.navigate(["./home/books"]);
        this.dialogRef.close();
      },
      error: (err) => {
        console.log('error:', err);
      },
    });
  }
  navigateToForgetPassword() {
    this.dialogRef.close();
    this.router.navigate(['/forget-password']);
  }

  async cartFinalization() {
    console.log('Finalizing cart...');
 
    let cartList: any[] = [];
 
    try {
      this.dataService.currentCartList.subscribe({
        next: (res: any) => {
          console.log(res);
          cartList = res;
        },
      });
 
      console.log(cartList);
 
      let token = localStorage.getItem('access_token');
      let headers = new HttpHeaders({
        'x-access-token': token || '',
      });
      const backendCart: BackendCartResponse = await firstValueFrom(
        this.http.get<BackendCartResponse>(
          'https://bookstore.incubation.bridgelabz.com/bookstore_user/get_cart_items',
          { headers }
        )
      );
      console.log(backendCart);
      this.BackendCartList = backendCart.result; // data present here
 
      console.log('backendCartList:: ', this.BackendCartList); // data is here
      console.log('dataServiceCartList:: ', this.DataServiceCartList); // data is here
 
      console.log(backendCart);
      console.log(cartList);
 
      let mergedFinalDataForCart = [];
 
      mergedFinalDataForCart = [...backendCart.result, ...cartList];
 
      console.log(mergedFinalDataForCart);
 
      let quantityMap = new Map();
 
      mergedFinalDataForCart.forEach((item) => {
        let bookName = item.product_id.bookName;
        if (quantityMap.has(bookName)) {
          quantityMap.get(bookName).quantityToBuy += item.quantityToBuy;
        } else {
          quantityMap.set(bookName, { ...item });
        }
      });
 
      let updatedCart = Array.from(quantityMap.values());
 
      updatedCart.map((cartItem) => {
        this.cartService
          .putCartDetails(
            cartItem.product_id._id,
            cartItem.quantityToBuy
          )
          .subscribe({
            next: (res: any) => {
              console.log('res', res);
            },
            error: (err: any) => {
              console.log('err', err);
            },
          });
      });
 
      let backendArray: any = backendCart.result;
      console.log(updatedCart);
 
      for (let i = 0; i < updatedCart.length; i++) {
        let item = updatedCart[i];
        let found = false;
        for (let j = 0; j < backendArray.length; j++) {
          if (
            backendArray[j].product_id.bookName === item.product_id.bookName
          ) {
            found = true;
            break;
          }
        }
 
        console.log(item);
 
        if (found) {
          console.log('PUT:', item._id, { quantityToBuy: item.quantityToBuy });
 
          this.http
            .put(
              `https://bookstore.incubation.bridgelabz.com/bookstore_user/cart_item_quantity/${item._id}`,
              { quantityToBuy: item.quantityToBuy },
              { headers }
            )
            .subscribe({
              next: (res: any) => {
                console.log('PUT Success:', res);
              },
              error: (err: any) => {
                console.error('PUT Error:', err);
              },
            });
        } else {
          console.log('POST:', item.product_id._id, item.product_id._id);
          this.cartService.postCartDetails(item.product_id._id,item.product_id._id).subscribe({
            next: (res:any) => {
              console.log(res);
              this.cartService.putCartDetails(res.result._id,item.quantityToBuy).subscribe({
                next:(res)=>console.log(res)
               
              })
            },
          });
        }
      }
 
      this.dataService.updateCartList(updatedCart);
    } catch (error) {
      console.error('Error finalizing cart', error);
    }
  }
}
