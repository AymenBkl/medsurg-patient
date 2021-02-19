import { Component, OnInit } from '@angular/core';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { ModalController, NavParams } from '@ionic/angular';
import { Order } from 'src/app/interfaces/order';
import { OrderProduct } from 'src/app/interfaces/orderCart';
import { User } from 'src/app/interfaces/user';
import { CashfreeService } from 'src/app/services/cashfree.service';
import { OrderService } from 'src/app/services/crm/order.service';
import { InteractionService } from 'src/app/services/interaction.service';
import { TranslateMedsurgService } from 'src/app/services/translate.service';

@Component({
  selector: 'app-refund',
  templateUrl: './refund.component.html',
  styleUrls: ['./refund.component.scss'],
})
export class RefundComponent implements OnInit {

  order: Order;
  currentUser: User;
  refundPrice:any = 0;
  constructor(private navParams: NavParams,
    private modalCntrl: ModalController,
    private orderService: OrderService,
    private interactionService: InteractionService,
    public translateService: TranslateMedsurgService) {
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.order = this.navParams.get('order');
    this.currentUser = this.navParams.get('user');
    if (this.order.refund.refund){
      this.refundPrice = this.order.refund.refund.refundPrice;
    }
    }

  goAddPrescription() {
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
    else {

    }
  }

  ionViewDidEnter() {
    console.log("entered")
    this.getData();
  }

  remove(product: OrderProduct){
    if (product.refundedQuantity > 0){
      product.refundedQuantity -= 1;
      this.refundPrice -= product.product.price;
    }
  }

  add(product: OrderProduct){
    if (product.refundedQuantity < product.quantity){
      product.refundedQuantity += 1;
      this.refundPrice += product.product.price;
    }
  }

 makeRefund(){
  this.interactionService.createLoading('LOADING_CREATING_REFUND')
  .then(() => {
    this.orderService.createRefund(this.order._id,this.order.products,this.refundPrice,this.order.pharmacy._id)
      .then((result: any) => {
        this.interactionService.hide();
        if (result && result != false) {
          this.interactionService.createToast('TOAST_REFUND_CREATED', 'success', 'bottom');
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

 updateRefund(){
  this.interactionService.createLoading('LOADING_UPDATING_REFUND')
  .then(() => {
    this.orderService.updateRefund(this.order._id,this.order.products,this.refundPrice,this.order.refund.refund._id)
      .then((result: any) => {
        this.interactionService.hide();
        if (result && result != false) {
          this.interactionService.createToast('TOAST_REFUND_UPDATED', 'success', 'bottom');
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




  

}
