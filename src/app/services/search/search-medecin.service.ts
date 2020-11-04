import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { config } from '../config';
import { SearchResponse } from '../../interfaces/responseSearch';
@Injectable({
  providedIn: 'root'
})
export class SearchMedecinService {

  url = config.baseURL;
  constructor(private httpClient: HttpClient) { }


  searchProducts(products){
    return new Promise((resolve, reject) => {
      this.httpClient.post<SearchResponse>(this.url + 'crm/productsmanagement/searchproducts', products)
        .subscribe(result => {
          if (result && result.status === 200){
            console.log(result.product[0].pharmacy);
            resolve(result.product);
          }
          else {
            resolve(false);
          }
        }, err => {
          if (err && err.status === 404){
            resolve(false);
          }
          else {
            reject(err);
          }
        });
    });
  }


}