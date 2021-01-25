import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from './config';
import * as CryptoJS from 'crypto-js';
import { Order } from '../interfaces/order';

@Injectable({
  providedIn: 'root',
})
export class CashfreeService {

  cashfreeURL: string = config.cashfree.url;
  constructor(private httpClient: HttpClient) { 
  }

  createToken(order:any){
    return new Promise((resolve,reject) => {
    const header = {
      headers: new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("x-client-id",config.cashfree.appId)
        .set("x-client-secret", config.cashfree.appKey)
    };
      this.httpClient.post(this.cashfreeURL + 'cftoken/order',order,header)
        .subscribe(data => {
          resolve(data)
        },err => {
          reject(err);
        })
    })
  }

  createOrder(order: Order) {

    return new Promise((resolve,reject) => {
      const header = {
        headers: new HttpHeaders()
          .set("Content-Type", "application/x-www-form-urlencoded")
      };
      let paramForm= new URLSearchParams();
      paramForm.append('appId',config.cashfree.appId);
      paramForm.append('secretKey',config.cashfree.appKey);
      paramForm.append('orderId',order._id);
      paramForm.append('orderAmount',order.totalPrice.toString());
      paramForm.append('orderNote','This order is made by' + order.patient.firstname + ' ' + order.patient.lastname);
      paramForm.append('customerName',order.patient.firstname + ' ' + order.patient.lastname);
      paramForm.append('customerPhone',order.patient.phoneNumber.toString());
      paramForm.append('customerEmail',order.patient.email);
      paramForm.append('returnUrl','');
        this.httpClient.post('https://test.cashfree.com/api/v1/order/create',paramForm.toString(),header)
          .subscribe(data => {
            resolve(data)
          },err => {
            reject(err);
          })
      })
  }


  checkLink(orderId: string) {
    return new Promise((resolve,reject) => {
      const header = {
        headers: new HttpHeaders()
          .set("Content-Type", "application/x-www-form-urlencoded")
      };
      let paramForm= new URLSearchParams();
      paramForm.append('appId',config.cashfree.appId);
      paramForm.append('secretKey',config.cashfree.appKey);
      paramForm.append('orderId',orderId);
        this.httpClient.post('https://test.cashfree.com/api/v1/order/info/link',paramForm.toString(),header)
          .subscribe(data => {
            resolve(data)
          },err => {
            reject(err);
          })
      })
  }


  paymentStatus(orderId: string) {
    return new Promise((resolve,reject) => {
      const header = {
        headers: new HttpHeaders()
          .set("Content-Type", "application/x-www-form-urlencoded")
      };
      let paramForm= new URLSearchParams();
      paramForm.append('appId',config.cashfree.appId);
      paramForm.append('secretKey',config.cashfree.appKey);
      paramForm.append('orderId',orderId);
        this.httpClient.post('https://test.cashfree.com/api/v1/order/info/status',paramForm.toString(),header)
          .subscribe(data => {
            resolve(data)
          },err => {
            reject(err);
          })
      })
  }

  capture(orderId: string,referencedId: string) {
    return new Promise((resolve,reject) => {
      const header = {
        headers: new HttpHeaders()
          .set("Content-Type", "application/x-www-form-urlencoded")
      };
      let paramForm= new URLSearchParams();
      paramForm.append('appId',config.cashfree.appId);
      paramForm.append('secretKey',config.cashfree.appKey);
      paramForm.append('referenceId','697888');
      paramForm.append('idemKey','697888' + 'aymenxyz');
      paramForm.append('captureAmount','80');
        this.httpClient.post('https://test.cashfree.com/api/v1/order/capture',paramForm.toString(),header)
          .subscribe(data => {
            resolve(data)
          },err => {
            reject(err);
          })
      })
  }

  saveCard() {
    return new Promise((resolve,reject) => {
      const header = {
        headers: new HttpHeaders()
          .set("Content-Type", "application/x-www-form-urlencoded")
      };
      let paramForm= new URLSearchParams();
      paramForm.append('appId',config.cashfree.appId);
      paramForm.append('secretKey',config.cashfree.appKey);
      paramForm.append('orderId','ORDER-15326');
      paramForm.append('orderAmount','150');
      paramForm.append('orderNote','test');
      paramForm.append('customerName','xyz');
      paramForm.append('customerPhone','9177091554');
      paramForm.append('customerEmail','sada@sada.dz');
      paramForm.append('returnUrl','http://localhost:8100/');
      paramForm.append('paymentOption',"card");
      paramForm.append("card_number","4444333322221111");
      paramForm.append("card_holder","John Doe");
      paramForm.append("card_expiryMonth","09");
      paramForm.append("card_expiryYear","2020");
      paramForm.append("card_expiryYear","2020");
      paramForm.append("card_cvv","123");
      paramForm.append("card_save","1");
      paramForm.append("phone",'9177091554');


        this.httpClient.post('https://test.cashfree.com/billpay/checkout/post/submit',paramForm.toString(),header)
          .subscribe(data => {
            resolve(data)
          },err => {
            reject(err);
          })
      })
  }


  getCards(){
    return new Promise((resolve,reject) => {
      const header = {
        headers: new HttpHeaders()
          .set("Content-Type", "application/x-www-form-urlencoded")
          .set('Cache-Control','no-cache')
      };
      let paramForm= new URLSearchParams();
      paramForm.append('appId',config.cashfree.appId);
      paramForm.append('secretKey',config.cashfree.appKey);
      paramForm.append("phone",'9177091554');


        this.httpClient.post('https://test.cashfree.com/api/v1/vault/cards/getCards',paramForm.toString(),header)
          .subscribe(data => {
            resolve(data)
          },err => {
            reject(err);
          })
      })
  }


  createOrderBillPay(){
    return new Promise((resolve,reject) => {
      const header = {
        headers: new HttpHeaders()
          .set("Content-Type", "application/json")
      };
      let data = {
        "appId" : config.cashfree.appId,
        "orderId" : 'ORDER-15326',
        "orderAmount" : "150",
        "orderCurrency" : 'INR',
        "orderNote" : "TEST",
        "customerName" : "AYMEN BKL",
        "customerPhone" : '9177091554',
        "customerEmail" : 'sada@sada.dz',
        "returnUrl" : 'http://localhost:8100/orders',
        "notifyUrl" : 'http://localhost:8100/orders',
      };
      let paramForm= new FormData();
      paramForm.append('appId',data.appId);
      paramForm.append('orderId',data.orderId);
      paramForm.append('orderAmount',data.orderAmount);
      paramForm.append('orderCurrency',data.orderCurrency);
      paramForm.append('orderNote',data.orderNote);
      paramForm.append('customerName',data.customerName);
      paramForm.append('customerPhone',data.customerPhone);
      paramForm.append('customerEmail',data.customerEmail);
      paramForm.append('returnUrl',data.returnUrl);
      paramForm.append('notifyUrl',data.notifyUrl);
      paramForm.append('signature',this.sortData(data));
      /**paramForm.append('paymentOption',"card");
      paramForm.append("card_number","4444333322221111");
      paramForm.append("card_holder","John Doe");
      paramForm.append("card_expiryMonth","09");
      paramForm.append("card_expiryYear","2020");
      paramForm.append("card_expiryYear","2020");
      paramForm.append("card_cvv","123");
      paramForm.append("card_save","1");
      paramForm.append("phone",'9177091554');**/


        this.httpClient.post('https://test.cashfree.com/billpay/checkout/post/submit',paramForm,header)
          .subscribe(data => {
            resolve(data)
          },err => {
            reject(err);
          })
      })
  }


  generateSignatuer(data){
    const secretKey = config.cashfree.appKey;
    let signatuerData = '';
    for(let key in data){
      signatuerData += key + data[key];
    }
    console.log(signatuerData);
    let signatuer = CryptoJS.HmacSHA256(signatuerData,secretKey).toString(CryptoJS.enc.Base64);
    console.log(signatuer);
    return signatuer;
  }


  sortData(data) {
    var tuples = [];

    for (var key in data) tuples.push([key, data[key]]);

    tuples.sort(function (a, b) {
      a = a[0];
      b = b[0];

      return a < b ? -1 : (a > b ? 1 : 0);
    });
    let newData = {}
    for (var i = 0; i < tuples.length; i++) {
      newData[tuples[i][0]] = tuples[i][1];
    }
    return this.generateSignatuer(newData);
  }


  

  


  
}
