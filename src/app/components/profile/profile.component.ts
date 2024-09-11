import { UserService } from 'src/app/Services/user/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  addressForm!: FormGroup;
  isEditingPersonalDetails = false;
  isEditingAddressDetails = false;
  isAddingNewAddress = false;

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      fullName: ['Poonam Yadav'],
      email: ['Poonam.Yadav@bridgelabz.com'],
      password: ['******'],
      mobile: ['81678954778']
    });

    this.addressForm = this.fb.group({
      address: [''],
      city: [''],
      state: [''],
      type: ['']
    });
  }

  editPersonalDetails() {
    this.isEditingPersonalDetails = true;
  }

  savePersonalDetails() {
    this.isEditingPersonalDetails = false;
  }

  addNewAddress() {
    this.isEditingAddressDetails = true;
    this.isAddingNewAddress = true;
    this.addressForm.reset();
  }

  editAddressDetails() {
    this.isEditingAddressDetails = true;
    this.isAddingNewAddress = false;
  }

  saveAddressDetails() {
    if (this.addressForm.valid) {
      const addressData = {
        addressType: this.addressForm.value.type,
        fullAddress: this.addressForm.value.address,
        city: this.addressForm.value.city,
        state: this.addressForm.value.state
      };

      this.userService.updateProfileAddress(addressData).subscribe(response => {
        console.log(response);
        alert((response as any).message);
        this.isEditingAddressDetails = false;
        this.isAddingNewAddress = false;
      });
    }
  }
}
