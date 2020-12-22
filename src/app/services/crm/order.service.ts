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
  orders: Order[] = [];
  orderSubject: Subject<Order[]> = new Subject<Order[]>();
  constructor(private httpClient: HttpClient) { }


  createOrder(order: Order) {
    return new Promise((resolve, reject) => {
      this.httpClient.post<OrderResponse>(this.orderUrl + 'createreorder', order)
        .subscribe(response => {
          console.log(response);
          if (response.status === 200) {
            this.orders.unshift(response.message);
            this.orderSubject.next(this.orders);
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

  getOrders(){
    return new Promise((resolve, reject) => {
      this.httpClient.get<OrderResponse>(this.orderUrl + 'getorder')
        .subscribe(response => {
          console.log(response);
          if (response.status === 200) {
            this.orders = response.message;
            this.orderSubject.next(this.orders);
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


  getOrderSubject() {
    this.orderSubject.next(this.orders);
    return this.orderSubject;
  }
}
