import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-please-login',
  templateUrl: './please-login.component.html',
  styleUrls: ['./please-login.component.scss']
})
export class PleaseLoginComponent {
  constructor(private router: Router,public dialog:MatDialog) {}

  
  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.height = '90vh'; // Set the height as needed
    dialogConfig.width = '100vw'; // Optionally set the width
    this.dialog.open(LoginComponent,dialogConfig);

  }
}
