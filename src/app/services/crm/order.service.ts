import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from '../config';
import { Subject } from 'rxjs';
import { Order } from 'src/app/interfaces/order';
import { OrderResponse } from 'src/app/interfaces/orderResponse';
import { OrderProduct } from 'src/app/interfaces/orderCart';
import { Commission } from 'src/app/interfaces/commission';
@Injectable({
  providedIn: 'root'
})
export class OrderService {

  orderUrl = config.baseURL + "crm/orders/";
  orders: Order[] = [];
  orderSubject: Subject<Order[]> = new Subject<Order[]>();
  commissions: Commission[] = [];

  constructor(private httpClient: HttpClient) {
    this.getCommision();
  }


  editOrder(orderId: string, newStatus: string) {
    return new Promise((resolve, reject) => {
      this.httpClient.put<OrderResponse>(this.orderUrl + 'updateorder/' + orderId, { status: newStatus })
        .subscribe(response => {
          console.log(response);
          if (response.status === 200) {
            console.log(this.orders.indexOf(response.message));
            this.updateOrder(response.message);
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

  payPickUp(orderId:string,refundId:string){
    return new Promise((resolve, reject) => {
      this.httpClient.put<OrderResponse>(this.orderUrl + 'pickuprefund/' + orderId, {payedByAdmin : 'PICKUP',refundId:refundId})
        .subscribe(response => {
          console.log(response);
          if (response.status === 200) {
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

  getOrders() {
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

  getRefunds() {
    return new Promise((resolve, reject) => {
      this.httpClient.get<OrderResponse>(this.orderUrl + 'allrefunds')
        .subscribe(response => {
          console.log(response);
          if (response.status === 200) {
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

  createRefund(orderId: string, products: OrderProduct[], refundPrice: Number,pharmacyId:string) {
    return new Promise((resolve, reject) => {
      this.httpClient.post<OrderResponse>(this.orderUrl + 'createrefund', { orderId: orderId, products: products, refundPrice: refundPrice,pharmacyId:pharmacyId })
        .subscribe(response => {
          console.log(response);
          if (response.status === 200) {
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

  updateRefund(orderId: string, products: OrderProduct[], refundPrice: Number,refundId:string) {
    return new Promise((resolve, reject) => {
      this.httpClient.put<OrderResponse>(this.orderUrl + 'updaterefund', { orderId: orderId, products: products, refundPrice: refundPrice,refundId:refundId })
        .subscribe(response => {
          console.log(response);
          if (response.status === 200) {
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
  getCommissions() {
    return new Promise((resolve, reject) => {

      this.httpClient.get<OrderResponse>(this.orderUrl + 'getcommission')
        .subscribe(response => {
          console.log(response);
          if (response.status === 200) {
            resolve(response.message);
            this.commissions = response.message;
          }
          else {
          }
        }, err => {

        });
    });
  }


  getOrderSubject() {
    this.orderSubject.next(this.orders);
    return this.orderSubject;
  }

  updateOrder(order: Order) {
    const ord = this.orders.find(x => x._id == order._id);
    this.orders[this.orders.indexOf(ord)].status = order.status;
    this.orderSubject.next(this.orders);
  }

  async getCommision() {
    return new Promise((resolve, reject) => {
      if (this.commissions == null || this.commissions.length == 0) {
        resolve(this.getCommissions());
      }
      else {
        resolve(this.commissions);
      }
    })
  }


}
