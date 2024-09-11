import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CartService } from 'src/app/Services/cart/cart.service';
import { DataService } from 'src/app/Services/data/data.service';
import { LOCATION_ICON } from 'src/assets/svg-icons';
import { LoginComponent } from '../login/login.component';
import { isAccessTokenPresent } from 'src/utils/utils';
import { getRandomImg } from 'src/utils/utils';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  allCartItems: any[] = [];
  isAddNewAddressVisible: boolean = true;
  cartItemCount: number = 0;
  isAddressEmpty: boolean = false;
  allAddress: any[] = [];
  address = {};

  isHomeEditing: boolean = false;
  isWorkEditing: boolean = false;
  isOtherEditing: boolean = false;

  userFullName: any = '';
  userPhoneNumber: any = '';

  orderPayload : any[] = [];
  hideMycart:any;

  token = localStorage.getItem("access_token");

  // create a interface later on
  customerDetails = {
    fullname: '',
    mobileNumber: '',
    address: '',
    city: '',
    state: '',
    addressType: '',
  };

  updateAddressObj = {
    addressType: '',
    fullAddress: '',
    city: '',
    state: '',
  };

  toggleMyCartState = 1;




  constructor(
    private dataService: DataService,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private cartService: CartService,
    private router: Router,
    public dialog: MatDialog
  ) {
    iconRegistry.addSvgIconLiteral(
      'location-icon',
      sanitizer.bypassSecurityTrustHtml(LOCATION_ICON)
    );
  }

  ngOnInit(): void {
    
    this.token = localStorage.getItem('access_token');



    this.dataService.currentCartList.subscribe({
      next: (res: any[]) => {
        console.log('res', res);
        let token = localStorage.getItem('access_token');
        //updating allCartItems
        this.allCartItems = res;
        console.log(this.allCartItems);

        if (token) {
          this.userFullName = localStorage.getItem('fname');
          this.userPhoneNumber = localStorage.getItem('phone');
          console.log(this.userPhoneNumber, this.userFullName);
        }

        //extracting address from cartlist Object
        if (token && res && res.length > 0) {
          let productObj = res[0];
          let { user_id } = productObj;
          this.allAddress = user_id.address;
          this.address = [...this.allAddress];
          console.log('address', this.address);
        }

      this.isAddressEmpty = this.allAddress?.length === 0 ? true : false;
      console.log(this.allAddress);

     },
      error: (err) => {
        console.log('err', err);
      },
    });
    console.log(this.allAddress);
  }



 
  

  toggleHomeEdit() {
    this.isHomeEditing = !this.isHomeEditing;
  }

  toggleWorkEdit() {
    this.isWorkEditing = !this.isWorkEditing;
  }

  toggleOtherEdit() {
    this.isOtherEditing = !this.isOtherEditing;
  }

  handleAddNewAddress() {
    
  }

  increaseCartItemCount(book: any) {
    book.quantityToBuy++;
    this.cartService
      .changeCartItemsQty(book._id, { quantityToBuy: book.quantityToBuy })
      .subscribe({
        next: (res: any) => {
          console.log('res', res);
        },
        error: (err: any) => {
          console.log('err', err);
        },
      });
  }

  decreaseCartItemCount(book: any) {
    book.quantityToBuy--;
    this.cartService
      .changeCartItemsQty(book._id, { quantityToBuy: book.quantityToBuy })
      .subscribe({
        next: (res: any) => {
          console.log('res', res);
        },
        error: (err: any) => {
          console.log('err', err);
        },
      });
  }

  handleCheckout() {
    console.log(this.allCartItems);
    this.dataService.updateOrderList(this.allCartItems);
    this.router.navigate(['/orderplaced']);
  }

  handleRemoveCartItem(book: any) {
    this.cartService.removeCartItem(book._id).subscribe({
      next: (res) => {
        this.allCartItems = this.allCartItems.filter(
          (obj: any) => obj._id !== book._id
        );
      },
      error: (err) => {
        console.log('err', err);
      },
    });
  }

  // handleAddressField() {
  //   console.log(this.allAddress);

  //   const capitalizeFirstLetter = (string: string) => {
  //     return string.charAt(0).toUpperCase() + string.slice(1);
  //   };

  //   if (this.updateAddressObj.addressType === 'Other') {

  //     // console.log(this.updateAddressObj.addressType);
  //     this.updateAddressObj.fullAddress = this.allAddress[0].fullAddress;
  //     this.updateAddressObj.city = this.allAddress[0].city;
  //     this.updateAddressObj.state = this.allAddress[0].state;

  //     // console.log(this.allAddress);

  //   } else if (this.updateAddressObj.addressType === 'Office') {

  //     // console.log(this.updateAddressObj.addressType);
  //     this.updateAddressObj.fullAddress = this.allAddress[1].fullAddress;
  //     this.updateAddressObj.city = this.allAddress[1].city;
  //     this.updateAddressObj.state = this.allAddress[1].state;

  //   } else if (this.updateAddressObj.addressType === 'Home') {

  //     // console.log(this.updateAddressObj.addressType);
  //     this.updateAddressObj.fullAddress = this.allAddress[2].fullAddress;
  //     this.updateAddressObj.city = this.allAddress[2].city;
  //     this.updateAddressObj.state = this.allAddress[2].state;

  //   }

  //   this.updateAddressObj.addressType
  //   console.log("Updated",this.updateAddressObj);

  //   this.cartService.updateCustomerAddress(this.updateAddressObj).subscribe({
  //     next: (res: any) => {
  //       console.log(res);
  //     },
  //   });

  //   // this.allAddress = [this.customerDetails, ...this.allAddress];
  // }

  handleAddressField() {
    console.log(this.customerDetails);
    console.log(this.updateAddressObj);

    const addressMap: { [key: string]: number } = {
      Other: 0,
      Office: 1,
      Home: 2,
    };

    let index =
      addressMap[
        this.isAddressEmpty == true
          ? this.customerDetails.addressType
          : this.updateAddressObj.addressType
      ];

    if (index !== undefined && this.isAddressEmpty === false) {
      const address = this.allAddress[index];
      this.updateAddressObj.fullAddress = address.fullAddress;
      this.updateAddressObj.city = address.city;
      this.updateAddressObj.state = address.state;
    }

    let addressPayloadOnEmptyAddress;

    if (this.isAddressEmpty) {
      const { address, addressType, city, state } = this.customerDetails;
      addressPayloadOnEmptyAddress = {
        addressType: addressType,
        fullAddress: address,
        city: city,
        state: state,
      };
    }

    console.log('Updated', this.updateAddressObj);

    this.cartService
      .updateCustomerAddress(
        this.isAddressEmpty === true
          ? addressPayloadOnEmptyAddress
          : this.updateAddressObj
      )
      .subscribe({
        next: (res: any) => {
          console.log('Address', res);
          // this.isAddNewAddressVisible = !this.isAddNewAddressVisible;
        },
      });

    // this.isAddNewAddressVisible = !this.isAddNewAddressVisible;
    this.toggleMyCartState = 3;
  }

  toogleAddressCnt() {
    this.isAddNewAddressVisible = !this.isAddNewAddressVisible;
  }



  handleRedirectCheckout() {
    this.dataService.updateOrderList(this.allCartItems);
    for (let item of this.allCartItems) {
      let itemObj = {
        product_id: item.product_id._id,
        product_name: item.product_id.bookName,
        product_quantity: item.quantityToBuy,
        product_price: item.product_id.discountedPrice,
      };
      this.orderPayload.push(itemObj);
    }
    this.cartService.addToOrder({ orders: this.orderPayload }).subscribe({
      next: (res: any) => {
        console.log(res);
      },
      error: (err: any) => {
        console.log(err);
      },
    });


    //making cart empty on checkout button
    for(let book of this.allCartItems){
      this.cartService.removeCartItem(book._id).subscribe({
        next:(res:any)=>{
          console.log(res);
        }
      })
    }

    this.dataService.updateCartList([]);

    this.router.navigate(['/orderplaced']);
  }

  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.height = '90vh';
    dialogConfig.width = '100vw';
    this.dialog.open(LoginComponent, dialogConfig);
  }

  handlePlaceOrderAccordian() {
    this.openDialog();
  }

  handleRedirectPlaceOrder() {
    if (localStorage.getItem('access_token')) {
      if (this.toggleMyCartState != 1) this.toggleMyCartState = 1;
      else{
        this.toggleMyCartState = 2;
      } 
      // this.toggleAddressState = !this.toggleAddressState;
    } else {
      this.openDialog();
    }
  }

  handleAddressClose() {
    this.toggleMyCartState = 3;
  }

  getBookImg(){
    return getRandomImg(); 
  }
}
