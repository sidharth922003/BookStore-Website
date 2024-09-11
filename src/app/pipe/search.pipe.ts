import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(dataList:any[],searchQuery:string) {
    if(!dataList){
      return [];
    }
    if(!searchQuery){
     return dataList;
    }
      searchQuery=searchQuery.toLowerCase();
      return dataList.filter((item)=>item.bookName.toLowerCase().includes(searchQuery) || item.author.toLowerCase().includes(searchQuery) )
    
  }

}
