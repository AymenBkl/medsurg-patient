import {HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from './config';
import * as CryptoJS from 'crypto-js';
import { Order } from '../interfaces/order';
import { HTTP } from '@ionic-native/http/ngx';


@Injectable({
  providedIn: 'root',
})
export class CashfreeService {

  cashfreeURL: string = config.cashfree.url;
  constructor(private http:HTTP) { 
  }

  createOrder(order: Order) {

    return new Promise((resolve,reject) => { 
      let option = {
        appId:config.cashfree.appId,
        secretKey:config.cashfree.appKey,
        orderId:order._id,
        orderAmount:order.totalPrice.toString(),
        orderNote:'This order is made by' + order.patient.firstname + ' ' + order.patient.lastname,
        customerName:order.patient.firstname + ' ' + order.patient.lastname,
        customerPhone:order.patient.phoneNumber.toString(),
        customerEmail:'test@test.dz',
        returnUrl:''
      }
        this.http.post('https://test.cashfree.com/api/v1/order/create',option,{'Content-Type': 'application/x-www-form-urlencoded'})
          .then(data => {
            resolve(JSON.parse(data.data))
          },err => {
            reject(err);
          })
      })
  }


  checkLink(orderId: string) {
    return new Promise((resolve,reject) => {
      let option = {
        appId:config.cashfree.appId,
        secretKey:config.cashfree.appKey,
        orderId:orderId,
      }
        this.http.post('https://test.cashfree.com/api/v1/order/info/link',option,{'Content-Type': 'application/x-www-form-urlencoded'})
          .then(data => {
            resolve(JSON.parse(data.data))
          },err => {
            reject(err);
          })
      })
  }


  paymentStatus(orderId: string) {
    return new Promise((resolve,reject) => {
      let option = {
        appId:config.cashfree.appId,
        secretKey:config.cashfree.appKey,
        orderId:orderId,
      }
      console.log('here');
        this.http.post('https://test.cashfree.com/api/v1/order/info/status',option,{'Content-Type': 'application/x-www-form-urlencoded'})
          .then(data => {
            resolve(JSON.parse(data.data))
          },err => {
            reject(err);
          })
      })
  }

 
  


  
}
