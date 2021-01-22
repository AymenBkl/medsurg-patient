import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from './config';
@Injectable({
  providedIn: 'root',
})
export class CashfreeService {

  cashfreeURL: string = config.cashfree.url;
  constructor(private httpClient: HttpClient) { 
    console.log("created");
  }

  createToken(amount:number){
    
    return new Promise((resolve,reject) => {
      console.log(config.cashfree.appId)
    const header = {
      headers: new HttpHeaders()
        .set("Content-Type", "application/application/json")
        .set("x-client-id",config.cashfree.appId)
        .set("x-client-secret", config.cashfree.appKey)
    };

    const order = {
      "orderId": "sasdsadkjaldjsaj",
      "orderAmount":amount,
      "orderCurrency": "INR"
     }
      this.httpClient.post(this.cashfreeURL + 'cftoken/order',order,header)
        .subscribe(data => {
          console.log(data);
        },err => {
          console.log("err",err);
        })
    })
  }
}
