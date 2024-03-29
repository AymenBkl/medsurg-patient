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
import { TranslateMedsurgService } from 'src/app/services/translate.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  currentUser: User;
  allOrder: {
    PENDING: { created: Order[], accepted: Order[], canceled: Order[], rejected: Order[], delivered: Order[], all: Order[] },
    SUCCESS: { created: Order[], accepted: Order[], canceled: Order[], rejected: Order[], delivered: Order[], all: Order[] },
    FAILED: { created: Order[], accepted: Order[], canceled: Order[], rejected: Order[], delivered: Order[], all: Order[] },
    ALL: { created: Order[], accepted: Order[], canceled: Order[], rejected: Order[], delivered: Order[], all: Order[] },
    ACTIVE: { created: Order[], accepted: Order[], canceled: Order[], rejected: Order[], delivered: Order[], all: Order[] }
  } =
    {
      PENDING: { created: [], accepted: [], canceled: [], rejected: [], delivered: [], all: [] },
      SUCCESS: { created: [], accepted: [], canceled: [], rejected: [], delivered: [], all: [] },
      FAILED: { created: [], accepted: [], canceled: [], rejected: [], delivered: [], all: [] },
      ALL: { created: [], accepted: [], canceled: [], rejected: [], delivered: [], all: [] },
      ACTIVE: { created: [], accepted: [], canceled: [], rejected: [], delivered: [], all: [] }
    }
  currentSegmentType: string = 'all';
  currentSegmentTypePayment: string = 'ALL'
  modalControllerOrder: ModalControllersOrders;
  paymentStatus: { created: PaymentStatus[], accepted: PaymentStatus[], canceled: PaymentStatus[], rejected: PaymentStatus[], delivered: PaymentStatus[], all: PaymentStatus[] } = { created: [], accepted: [], canceled: [], rejected: [], delivered: [], all: [] };
  constructor(private ordersService: OrderService,
    private authService: AuthService,
    private interactionService: InteractionService,
    private modalCntrl: ModalController,
    private cashfree: CashfreeService,
    public translateService: TranslateMedsurgService) {
    this.modalControllerOrder = new ModalControllersOrders(this.modalCntrl);
  }

  ngOnInit() {
    
  }


  getAllOrders() {
    this.interactionService.createLoading("LOADING_ORDERS")
      .then(() => {
        this.ordersService.getOrders()
          .then((result: any) => {
            this.interactionService.hide();
            if (result && result != false) {
              console.log(result);
              if (result.length != 0) {
                this.filterOrders(result);
                this.interactionService.createToast('TOAST_ORDERS_LOADED', 'success', 'bottom');
              }
              else {
                this.interactionService.createToast('TOAST_ORDERS_NONE', 'warning', 'bottom');
              }
            }
            else {
              this.interactionService.createToast('TOAST_ERROR', 'danger', 'bottom');
            }
          })
          .catch(err => {
            this.interactionService.hide();
            if (err.status == 404) {
              this.interactionService.createToast('TOAST_ORDERS_NONE1', 'warrning', 'bottom');
            }
            else {
              this.interactionService.createToast('TOAST_ERROR', 'danger', 'bottom');
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
    this.modalControllerOrder.callEditOrder(this.currentUser, order)
  }

  async filterOrders(orders: Order[]) {
    this.allOrder = {
      PENDING: { created: [], accepted: [], canceled: [], rejected: [], delivered: [], all: [] },
      SUCCESS: { created: [], accepted: [], canceled: [], rejected: [], delivered: [], all: [] },
      FAILED: { created: [], accepted: [], canceled: [], rejected: [], delivered: [], all: [] },
      ALL: { created: [], accepted: [], canceled: [], rejected: [], delivered: [], all: [] },
      ACTIVE: { created: [], accepted: [], canceled: [], rejected: [], delivered: [], all: [] }
    };
    for(let order of orders){
      console.log(order);
      let r = await this.cashfree.paymentStatus(order._id)
          .then(async (paymentStatus: PaymentStatus) => {
            console.log(paymentStatus);
            if (order.method == 'card' && paymentStatus.status == 'OK'){
              let result = await this.affectCard(order,paymentStatus);
            }
            else if (order.method == 'cod' && paymentStatus.status == 'ERROR'){
              this.allOrder.ALL.all.push(order);
              this.allOrder.SUCCESS[order.status].push(order);
              this.allOrder.SUCCESS.all.push(order);
            }
          })
      
    };
  }

  segmentChanged(event) {
    this.currentSegmentType = event.detail.value;
    console.log(this.currentSegmentType, this.currentSegmentTypePayment)
  }

  segmentChangedPayment(event) {
    this.currentSegmentTypePayment = event.detail.value;
  }

  async affectCard(order: Order,paymentStatus) {
    if (paymentStatus.txStatus == "SUCCESS" && order.status == 'created') {
      this.updateOrder('accepted', order._id);
    }
    order.paymentStatus = paymentStatus;
    this.allOrder.ALL.all.push(order);
    this.allOrder.ALL[order.status].push(order);
    if (order.paymentStatus && order.paymentStatus.txStatus) {
      if (order.paymentStatus.txStatus in this.allOrder) {
        this.allOrder[order.paymentStatus.txStatus].all.push(order)
        this.allOrder[order.paymentStatus.txStatus][order.status].push(order);
      }
      else {
        this.allOrder.PENDING.all.push(order)
        this.allOrder.PENDING[order.status].push(order);
      }
      
    }
    else if (order.paymentStatus && !order.paymentStatus.txStatus) {
      this.allOrder[order.paymentStatus.orderStatus].all.push(order)
      this.allOrder[order.paymentStatus.orderStatus][order.status].push(order);
    }
    

  }

  updateOrder(status: string, orderId: string) {
    this.ordersService.editOrder(orderId, status)
      .then((result: any) => {
      })
      .catch(err => {
      })
  }

  ionViewDidEnter(){
    this.allOrder = {
      PENDING: { created: [], accepted: [], canceled: [], rejected: [], delivered: [], all: [] },
      SUCCESS: { created: [], accepted: [], canceled: [], rejected: [], delivered: [], all: [] },
      FAILED: { created: [], accepted: [], canceled: [], rejected: [], delivered: [], all: [] },
      ALL: { created: [], accepted: [], canceled: [], rejected: [], delivered: [], all: [] },
      ACTIVE: { created: [], accepted: [], canceled: [], rejected: [], delivered: [], all: [] }
    };
    this.currentUser = this.authService.user;
    this.getAllOrders();
  }




}
