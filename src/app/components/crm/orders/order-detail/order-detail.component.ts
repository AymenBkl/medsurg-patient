import { Component, OnInit } from '@angular/core';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { ModalController, NavParams } from '@ionic/angular';
import { ModalControllersOrders } from 'src/app/classes/modalController.orders';
import { Order } from 'src/app/interfaces/order';
import { User } from 'src/app/interfaces/user';
import { CashfreeService } from 'src/app/services/cashfree.service';
import { OrderService } from 'src/app/services/crm/order.service';
import { InteractionService } from 'src/app/services/interaction.service';
import { TranslateMedsurgService } from 'src/app/services/translate.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnInit {

  order: Order;
  currentUser: User;
  modalControllerOder: ModalControllersOrders;
  isValidRefund:boolean = true;
  constructor(private navParams: NavParams,
    private modalCntrl: ModalController,
    private orderService: OrderService,
    private interactionService: InteractionService,
    private cashfree: CashfreeService,
    private iab: InAppBrowser,
    public translateService: TranslateMedsurgService) {
      this.modalControllerOder = new ModalControllersOrders(modalCntrl);
  }

  ngOnInit() {
  }

  getData() {
    this.order = this.navParams.get('order');
    this.currentUser = this.navParams.get('user');
    if (this.order.refund && this.order.refund.refund){
      this.order.totalPrice -= this.order.refund.refund.refundPrice;
    }
    }


  getProductNames() {
    var productNames: string[] = [];
    this.order.products.map(product => {
      productNames.push(product.product.mainProduct.name + '\n');
    })
    return productNames;
  }



  updateOrder(status: string) {
    this.interactionService.createLoading('LOADING_UPDATINGSTATUS_ORDER')
      .then(() => {
        this.orderService.editOrder(this.order._id, status)
          .then((result: any) => {
            this.interactionService.hide();
            if (result && result != false) {
              this.interactionService.createToast('TOAST_ORDER_UPDATED', 'success', 'bottom');
              setTimeout(() => {
                this.modalCntrl.dismiss(null);
              }, 1500);
            }
            else {
              this.interactionService.createToast('TOAST_ERROR', 'danger', 'bottom');
            }
          })
          .catch(err => {
            this.interactionService.hide();
            this.interactionService.createToast('TOAST_ERROR', 'danger', 'bottom');
          })
      })
  }

  checkStatus() {
    if (this.order.status == 'created') {
      this.updateOrder('canceled');
    }
    else if (this.order.paymentStatus && (((this.order.paymentStatus.txStatus && (this.order.paymentStatus.txStatus == 'SUCCESS')) || ((!this.order.paymentStatus.txStatus && this.order.paymentStatus.orderStatus == 'PAID'))) && this.order.status == 'accepted')){
      this.updateOrder('canceled');
    }
  }

  ionViewDidEnter() {
    this.getData();
    this.checkOrderDate();

  }


  getPaymentLink() {
    console.log("here",this.order);
    if (((this.order.paymentStatus.txStatus && (this.order.paymentStatus.txStatus == "PENDING" || this.order.paymentStatus.txStatus == "FAILED" || this.order.paymentStatus.txStatus == 'USER_DROPPED')) || ((!this.order.paymentStatus.txStatus && this.order.paymentStatus.orderStatus == 'ACTIVE'))) && this.order.status == 'created') {
      this.cashfree.checkLink(this.order._id)
        .then((payment:any) => {
          this.inAppBrowser(payment.paymentLink);
        })
        .catch(err => {
        })
    }
  }


  inAppBrowser(link) {
    console.log(link);
    const options: InAppBrowserOptions = {
      zoom: "no",
      fullscreen: "yes",
      hidenavigationbuttons: "no",
      toolbar: "no",
      hideurlbar: "yes",
    };
    const browser = this.iab.create(link, '_system', {
      toolbar: "yes",
      hideurlbar: "no",
      fullscreen: "yes",
      location: "yes",
      closebuttoncolor: 'danger',
      closebuttoncaption: 'Close',

      options,
    });
    browser.on('loadstart')
      .subscribe(event => {
        console.log(event)
      })
  }

  callRefund(){
    if (this.isValidRefund){
      this.modalControllerOder.callRefund(this.currentUser,this.order);
    }
  }

  updateRefund(){
    if (this.isValidRefund){
      this.modalControllerOder.callRefund(this.currentUser,this.order);
    }
  }

  checkOrderDate(){
    const orderDate = (new Date(this.order.createdAt).getTime() / 1000) + 15*600;
    const finish = (new Date().getTime() / 1000);
    this.isValidRefund = orderDate > finish && this.order.status == 'delivered' && ((this.order.method == 'card' && this.order.paymentStatus && this.order.paymentStatus.txStatus == "SUCCESS") || this.order.method == 'cod');
  }

  callRefundDetail(){
    this.modalControllerOder.callRefundDetail(this.currentUser,this.order);
  }


  async cancelOrder(){
    await this.order.products.map(product => {
      product.refundedQuantity = product.quantity;
    })
    this.interactionService.createLoading('LOADING_CREATING_REFUND')
  .then(() => {
    this.orderService.createRefund(this.order._id,this.order.products,this.order.totalPrice,this.order.pharmacy._id)
      .then((result: any) => {
        this.interactionService.hide();
        if (result && result != false) {
          this.interactionService.createToast('TOAST_REFUND_CREATED', 'success', 'bottom');
          this.pickUp(this.order._id,result.refund.refund);
          setTimeout(() => {
            this.modalCntrl.dismiss(null);
          }, 1500);
        }
        else {
          this.interactionService.createToast('TOAST_ERROR', 'danger', 'bottom');
        }
      })
      .catch(err => {
        this.interactionService.hide();
        this.interactionService.createToast('TOAST_ERROR', 'danger', 'bottom');
      })
  })
  }


  pickUp(orderId: string,refundId:string){
    console.log(refundId);
    this.orderService.payPickUp(orderId,refundId)
      .then((result) => {
        if (result && result != false){
          this.interactionService.createToast('TOAST_ORDER_UPDATED', 'success', 'bottom');
          this.checkStatus();
        }
        else {
          this.interactionService.createToast('TOAST_ERROR', 'danger', 'bottom');
        }
      })
      .catch(err => {
        this.interactionService.createToast('TOAST_ERROR', 'danger', 'bottom');
      })
  }






}



