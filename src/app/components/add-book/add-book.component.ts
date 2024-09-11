import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/Services/admin/admin.service';
 
@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss']
})
export class AddBookComponent implements OnInit {
  bookForm!: FormGroup;
 
  constructor(
    private fb: FormBuilder,private adminService:AdminService,private router: Router
  ) {}
 
  ngOnInit(): void {
    this.bookForm = this.fb.group({
      bookName: ['', Validators.required],
      author: ['', Validators.required],
      description: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      discountPrice: [0, [Validators.min(0)]]
    });
  }
  get registerControl() {
    return this.bookForm.controls;
  }
 
  addBook() {
    if (this.bookForm.invalid) {
      console.log(this.bookForm.invalid);
      return;
    }
 
    const { bookName, author, description, quantity,price,discountPrice } = this.bookForm.value
 
    let add = {
      bookName: bookName,
      author: author,
      description: description,
      quantity: quantity,
      price: price,
      discountPrice:discountPrice
    }
 
 
    console.log(add);
 
 
    this.adminService.addBookApiCall(add).subscribe({
      next: (res) => {
        console.log("response:", res);
        this.adminService.bookAdded(add);
      },
      error: (err) => {
        console.log("error:", err);
      }
    });
    this.router.navigate(['/admin']);
 
 
  }
}