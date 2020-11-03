import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { config } from '../config';
@Injectable({
  providedIn: 'root'
})
export class SearchMedecinService {

  url = config.baseURL;
  constructor(private httpClient: HttpClient) { }


  searchProducts(products){
    return new Promise((resolve,reject) => {
      this.httpClient.post(this.url + 'crm/productsmanagement/searchproducts', products)
        .subscribe(result => {
          console.log(result);
        }, err => {
          console.log(err);
        });
    })
  }


}
