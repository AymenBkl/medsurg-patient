import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Order } from 'src/app/interfaces/order';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/crm/order.service';
import { InteractionService } from 'src/app/services/interaction.service';
import { ModalControllersOrders } from 'src/app/classes/modalController.orders';
import { config } from 'src/app/services/config';
import { CashfreeService } from 'src/app/services/cashfree.service';
import { PaymentStatus } from 'src/app/interfaces/paymentStatus';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  currentUser: User;
  totalOrders: {created:Order[],accepted:Order[],canceled:Order[],rejected:Order[],delivered:Order[],all:Order[]} = {created:[],accepted:[],canceled:[],rejected:[],delivered:[],all:[]};
  currentSegmentType: string = 'all';
  modalControllerOrder: ModalControllersOrders; 
  paymentStatus:{created:PaymentStatus[],accepted:PaymentStatus[],canceled:PaymentStatus[],rejected:PaymentStatus[],delivered:PaymentStatus[],all:PaymentStatus[]} = {created:[],accepted:[],canceled:[],rejected:[],delivered:[],all:[]};
  constructor(private ordersService: OrderService,
              private authService: AuthService,
              private interactionService: InteractionService,
              private modalCntrl: ModalController,
              private cashfree: CashfreeService) { 
                this.modalControllerOrder = new ModalControllersOrders(this.modalCntrl);
              }

  ngOnInit() {
    this.currentUser = this.authService.user;
    this.subscribetoOrders();
    this.getAllOrders();
  }


  getAllOrders(){
    this.interactionService.createLoading("Loading Your Message !! ..")
      .then(() => {
        this.ordersService.getOrders()
          .then((result: any) => {
            this.interactionService.hide();
            if (result && result != false) {
              this.filterOrders(result);
              if (result.length != 0) {
                this.interactionService.createToast('Your Orders has been loaded !', 'success', 'bottom');
              }
              else {
                this.interactionService.createToast('You dont have any orders !', 'warning', 'bottom');
              }
            }
            else {
              this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
            }
          })
          .catch(err => {
            this.interactionService.hide();
            if (err.status == 404) {
              this.interactionService.createToast('No Orders Found !', 'warrning', 'bottom');
            }
            else {
              this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
            }
          });
      })
  }

  subscribetoOrders() {
    this.ordersService.getOrderSubject()
      .subscribe(orders => {
        this.filterOrders(orders);
      })
  }

  goToOrderDetail(order: Order) {
    this.modalControllerOrder.callEditOrder(this.currentUser,order)
  }

  filterOrders(orders: Order[]) {
    this.totalOrders = {created:[],accepted:[],canceled:[],rejected:[],delivered:[],all:[]}

    orders.map(order => {
      console.log("lol",order.status,order._id);
      order.method === 'card' ? this.checkPaymentStatus(order.status,order._id) : '';
      this.totalOrders[order.status].push(order);
      this.totalOrders.all.push(order);
      
    });
  }

  segmentChanged(event){
    this.currentSegmentType = event.detail.value;
  }

  checkPaymentStatus(orderStatus:string,orderId:string){
    this.cashfree.paymentStatus(orderId)
      .then((paymentStatus:PaymentStatus) => {
        console.log(paymentStatus);
        this.paymentStatus[orderStatus].push(paymentStatus);
        this.paymentStatus.all.push(paymentStatus);
        console.log(this.paymentStatus)
      })
  }



}
