import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { DataService } from 'src/app/Services/data/data.service';
import { LoginComponent } from '../login/login.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddBookComponent } from '../add-book/add-book.component';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent implements OnInit {

  constructor(private dataService:DataService,public dialog:MatDialog,private router:Router) { }
 searchQuery:string="";
 isLogin:boolean=false;
  ngOnInit(): void {
    this.dataService.adminState$.subscribe(isAuthenticated => {
      this.isLogin = isAuthenticated;
    });
  }
  setSearchQuery(){
    this.dataService.getSearchQuery(this.searchQuery);
  }
  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.height = '90vh'; 
    dialogConfig.width = '100vw'; 
    dialogConfig.enterAnimationDuration = enterAnimationDuration;
    dialogConfig.exitAnimationDuration = exitAnimationDuration;
    this.dialog.open(LoginComponent,dialogConfig);

  }
  openAddBook(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.router.navigate(['/add-book'])

  }
  handleLogOut(){
    localStorage.clear();
    this.router.navigate(['/home/books']);
    this.dataService.logoutAdmin(); 

    this.dataService.updateCartList([]); 
    this.dataService.updateWishList([]);
  }
  
}
