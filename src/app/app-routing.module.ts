import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { OrdersListComponent } from './components/orders-list/orders-list.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { CartComponent } from './components/cart/cart.component';
import { ProfileComponent } from './components/profile/profile.component';
import { BookContainerComponent } from './components/book-container/book-container.component';
import { BookDescriptionComponent } from './components/book-description/book-description.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { OrderPlacedComponent } from './components/order-placed/order-placed.component';
import { PleaseLoginComponent } from './components/please-login/please-login.component';
import { AddBookComponent } from './components/add-book/add-book.component';
import { AdminContainerComponent } from './components/admin-container/admin-container.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component:BookContainerComponent },
  {
    path: 'forget-password',
    component: ForgetPasswordComponent,
  },
  {
    path: 'add-book',
    component: AddBookComponent,
  },
  {
    path:"orderplaced",
    component:OrderPlacedComponent
  },
  {
    path:'admin',
    component: AdminContainerComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: 'wishlist',
        component: WishlistComponent,
      },
      {
        path: 'order-list',
        component: OrdersListComponent,
      },
      {
        path: 'cart',
        component: CartComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'books',
        component: BookContainerComponent,
      },
      {
        path: 'books/:id',
        component: BookDescriptionComponent,
      },
      {
        path: 'wishlist/please-login',
        component: PleaseLoginComponent,
      }
     
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
