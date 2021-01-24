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
  data = {
    "appId": config.cashfree.appId,
    "orderId": 'ORDER-1532610111',
    "orderAmount": "150",
    "orderCurrency": 'INR',
    "orderNote": "TEST",
    "customerName": "AYMEN BKL",
    "customerPhone": '9177091554',
    "customerEmail": 'sada@sada.dz',
    "returnUrl": 'http://localhost:8000/',
  };
  @ViewChild('redirectForm') form: ElementRef;
  sign: any;
  constructor(private ordersService: OrderService,
              private authService: AuthService,
              private interactionService: InteractionService,
              private modalCntrl: ModalController,
              private cashfree: CashfreeService) { 
                this.modalControllerOrder = new ModalControllersOrders(this.modalCntrl);
              }

  ngOnInit() {
    this.sign = this.sortData();
    setTimeout(() => {
      this.form.nativeElement.submit();
    }, 1500)
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
      this.totalOrders[order.status].push(order);
      this.totalOrders.all.push(order);
      
    });
  }

  segmentChanged(event){
    this.currentSegmentType = event.detail.value;
  }

  sortData() {
    var tuples = [];

    for (var key in this.data) tuples.push([key, this.data[key]]);

    tuples.sort(function (a, b) {
      a = a[0];
      b = b[0];

      return a < b ? -1 : (a > b ? 1 : 0);
    });
    let newData = {}
    for (var i = 0; i < tuples.length; i++) {
      newData[tuples[i][0]] = tuples[i][1];
    }
    return this.cashfree.generateSignatuer(newData);
  }


}
