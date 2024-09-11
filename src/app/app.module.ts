import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { BookCardComponent } from './components/book-card/book-card.component';
import { BookDescriptionComponent } from './components/book-description/book-description.component';
import { LoginComponent } from './components/login/login.component';
import { CartComponent } from './components/cart/cart.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { OrdersListComponent } from './components/orders-list/orders-list.component';
import { ProfileComponent } from './components/profile/profile.component';
import { OrderPlacedComponent } from './components/order-placed/order-placed.component';
import { BookContainerComponent } from './components/book-container/book-container.component';
import { HeaderComponent } from './components/header/header.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import {MatMenuModule} from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { SearchPipe } from './pipe/search.pipe';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatIconModule } from '@angular/material/icon';
import { PleaseLoginComponent } from './components/please-login/please-login.component';
import { AddBookComponent } from './components/add-book/add-book.component';
import { AdminContainerComponent } from './components/admin-container/admin-container.component';
import { AdminHeaderComponent } from './components/admin-header/admin-header.component'
import {MatBadgeModule} from '@angular/material/badge';




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    BookCardComponent,
    BookDescriptionComponent,
    LoginComponent,
    CartComponent,
    WishlistComponent,
    OrdersListComponent,
    ProfileComponent,
    OrderPlacedComponent,
    BookContainerComponent,
    HeaderComponent,
    ForgetPasswordComponent,
    SearchPipe,
    PleaseLoginComponent,
    AddBookComponent,
    AdminContainerComponent,
    AdminHeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatMenuModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatTabsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    ScrollingModule,
    MatIconModule,
    ReactiveFormsModule,
    MatBadgeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
