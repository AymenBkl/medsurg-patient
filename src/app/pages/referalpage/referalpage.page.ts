import { Component, OnInit } from '@angular/core';
import { Commission } from 'src/app/interfaces/commission';
import { Order } from 'src/app/interfaces/order';
import { Referal } from 'src/app/interfaces/referal';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/crm/order.service';
import { ReferalService } from 'src/app/services/crm/referal.service';

@Component({
  selector: 'app-referalpage',
  templateUrl: './referalpage.page.html',
  styleUrls: ['./referalpage.page.scss'],
})
export class ReferalpagePage implements OnInit {

  currentUser: User;
  referal: Referal;
  noRef: boolean;
  comission : Commission;
  totalPrice:{PAID: number,NPAID:number} = {PAID:0,NPAID:0};
  constructor(private referalService: ReferalService,
              private authService: AuthService,
              private orderService: OrderService) { }

  ngOnInit() {
    this.getReferalCommission();
  }

  ionViewDidEnter(){
    this.getUser();
  }

  getReferal(){
    this.referalService.getReferal()
      .then((result: any) => {
        console.log(result,this.noRef);
          if (result != false){
            this.noRef = false;
            this.referal = result;
            this.countTotalPrice(this.referal);
          }
          else {
            this.noRef = true;
          }
          console.log(this.noRef);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  getUser() {
    this.currentUser = this.authService.user;
    this.getReferal();
  }

  countTotalPrice(referal: Referal) {
    if (referal){
      referal.orders.map(order => {
        if (order.status == 'delivered'){
          if (order.referal.payedByAdmin == 'PAID' && this.checkOrderDate(order)){
            if (order.refund.refund){
              order.totalPrice -= order.refund.refund.refundPrice;
              this.totalPrice.PAID += order.totalPrice - (order.totalPrice*order.referal.commissionApplied)/100;
            }
            else {
              this.totalPrice.PAID += order.totalPrice - (order.totalPrice*order.referal.commissionApplied)/100;
            }
          }
          else {
            console.log(referal);
            if (order.refund.refund != null){
              order.totalPrice -= order.refund.refund.refundPrice;
            }
            this.totalPrice.NPAID += order.totalPrice - (order.totalPrice*this.comission.commission)/100;
          }
          
        }
      })
    }
  }

  checkOrderDate(order: Order){
    const orderDate = (new Date(order.createdAt).getTime() / 1000) + 60;
    const finish = (new Date().getTime() / 1000);
    return orderDate > finish && order.status == 'delivered' && ((order.method == 'card' && order.paymentStatus && order.paymentStatus.txStatus == "SUCCESS") || order.method == 'cod');
  }

  getReferalCommission(){
    this.orderService.getCommision()
      .then((result:Commission[]) => {
        this.comission = result.filter(commission => {return commission.name == 'Referal'})[0];
      })
  }



}
