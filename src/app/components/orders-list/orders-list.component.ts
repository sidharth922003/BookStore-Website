import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/Services/data/data.service';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements OnInit {

  ordersList : any [] = [];

  constructor(private dataService:DataService) { }

  ngOnInit(): void { 
    this.dataService.currentOrderList.subscribe({
      next:(res:any)=>{
        console.log("res",res);
        this.ordersList = res;
      }
    })
  }

  randomDateGenerator() {
    const months = ["January", "February", "March", "April", "May", "June", 
                    "July", "August", "September", "October", "November", "December"];
    
    // Generate a random month (0-11)
    const monthIndex = Math.floor(Math.random() * 12);
    const month = months[monthIndex];
    
    // Generate a random day (1-31)
    const day = Math.floor(Math.random() * 31) + 1;
    
    return `Order Placed on ${month} ${day}`;
  } 
}
