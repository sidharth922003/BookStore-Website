import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/Services/admin/admin.service';
import { BookService } from 'src/app/Services/book/book.service';
import { DataService } from 'src/app/Services/data/data.service';
import { getRandomImg } from 'src/utils/utils';

@Component({
  selector: 'app-book-container',
  templateUrl: './book-container.component.html',
  styleUrls: ['./book-container.component.scss'],
})
export class BookContainerComponent implements OnInit {
  allBooks: any[] = [];
  paginatedBooks: any[] = [];
  sortedBooks: any[] = [];
  searchQuery: string = "";
  currentPage: number = 1;
  itemsPerPage: number = 12;
  totalPages: number = 1;
  pages: number[] = [];
  totalBooks: number = 0; 



  constructor ( private admin:AdminService,  private bookService: BookService, private dataService: DataService) { }

  ngOnInit(): void {
    this.bookService.getAllBooks().subscribe({
      next: (res: any) => {
        this.allBooks = res.result;
        this.sortedBooks = [...this.allBooks];
        this.totalBooks = this.allBooks.length; 
        this.totalPages = Math.ceil(this.allBooks.length / this.itemsPerPage);
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        this.updatePaginatedBooks();
      },
      error: (err) => {
        console.log("Error", err);
      }
    });

    this.admin.addedBook.subscribe((res)=>{
      console.log(this.allBooks.length);
      
      this.allBooks.push(res);
      console.log(this.allBooks.length);
      
    })
    this.dataService.currentQuery.subscribe({
      next: (res) => {
        this.searchQuery = res;
      }
    });
  }

  updatePaginatedBooks() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedBooks = this.allBooks.slice(startIndex, endIndex);
  }

  sortBooks(criteria: string) {
    if (criteria == 'lowHigh') {
      this.allBooks = this.sortedBooks.sort((a, b) => a.discountPrice - b.discountPrice);
    } else if (criteria == 'highLow') {
      this.allBooks = this.sortedBooks.sort((a, b) => b.discountPrice - a.discountPrice);
    } else if (criteria == 'newest') {
      this.allBooks = this.sortedBooks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    this.updatePaginatedBooks();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedBooks();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedBooks();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePaginatedBooks();
  }

  getBookImage(){
    return getRandomImg();
  }


}
