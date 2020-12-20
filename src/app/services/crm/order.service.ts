import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from '../config';
import { Subject } from 'rxjs';
import { Order } from 'src/app/interfaces/order';
import { OrderResponse } from 'src/app/interfaces/orderResponse';
@Injectable({
  providedIn: 'root'
})
export class OrderService {

  orderUrl = config.baseURL + "crm/orders/";
  order: Order;
  orderSubject: Subject<Order> = new Subject<Order>();
  constructor(private httpClient: HttpClient) { }


  createOrder(order: Order) {
    return new Promise((resolve, reject) => {
      this.httpClient.post<OrderResponse>(this.orderUrl + 'createorder', order)
        .subscribe(response => {
          console.log(response);
          if (response.status === 200) {
            this.order = response.message;
            this.orderSubject.next(this.order);
            resolve(response.message);
          }
          else {
            resolve(false);
          }
        }, err => {
          reject(err);
        });
      });
  }

  getorder(){
    return new Promise((resolve, reject) => {
      this.httpClient.get<OrderResponse>(this.orderUrl + 'getorder')
        .subscribe(response => {
          console.log(response);
          if (response.status === 200) {
            this.order = response.message;
            this.orderSubject.next(this.order);
            resolve(response.message);
          }
          else {
            resolve(false);
          }
        }, err => {
          if (err.status == 404) {
            resolve(false)
          }
          else {
            reject(err);
          }
        });
      });
  }


  getorderSubject() {
    this.orderSubject.next(this.order);
    return this.orderSubject;
  }
}
