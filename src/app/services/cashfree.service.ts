import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
    const header = {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
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
          resolve(data)
        },err => {
          reject(err);
        })
    })
  }

  createOrder(token) {

    return new Promise((resolve,reject) => {
      const header = {
        headers: new HttpHeaders()
          .set("Content-Type", "application/x-www-form-urlencoded")
      };
      let paramForm= new URLSearchParams();
      paramForm.append('appId',config.cashfree.appId);
      paramForm.append('secretKey',config.cashfree.appKey);
      paramForm.append('orderId','ODER-1045452');
      paramForm.append('orderAmount','150');
      paramForm.append('orderNote','test');
      paramForm.append('customerName','xyz');
      paramForm.append('customerPhone','9177091554');
      paramForm.append('customerEmail','sada@sada.dz');
      paramForm.append('returnUrl','http://localhost:8100/');
        this.httpClient.post('https://test.cashfree.com/api/v1/order/create',paramForm.toString(),header)
          .subscribe(data => {
            resolve(data)
          },err => {
            reject(err);
          })
      })
  }


  
}
