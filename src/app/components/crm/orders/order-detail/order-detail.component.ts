import { Component, OnInit } from '@angular/core';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { ModalController, NavParams } from '@ionic/angular';
import { Order } from 'src/app/interfaces/order';
import { User } from 'src/app/interfaces/user';
import { CashfreeService } from 'src/app/services/cashfree.service';
import { OrderService } from 'src/app/services/crm/order.service';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnInit {

  order: Order;
  currentUser: User;
  constructor(private navParams: NavParams,
    private modalCntrl: ModalController,
    private orderService: OrderService,
    private interactionService: InteractionService,
    private cashfree: CashfreeService,
    private iab: InAppBrowser) {
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.order = this.navParams.get('order');
    this.currentUser = this.navParams.get('user');
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
    this.interactionService.createLoading('Updating your order status ! Please Wait')
      .then(() => {
        this.orderService.editOrder(this.order._id, status)
          .then((result: any) => {
            this.interactionService.hide();
            if (result && result != false) {
              this.interactionService.createToast('Your Order Has been Updated !', 'success', 'bottom');
              setTimeout(() => {
                this.modalCntrl.dismiss(null);
              }, 1500);
            }
            else {
              this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
            }
          })
          .catch(err => {
            this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
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


  getPaymentLink() {
    console.log("here",this.order);
    if ((this.order.paymentStatus.txStatus == "PENDING" || this.order.paymentStatus.txStatus == "FAILED ") && this.order.status == 'created') {
      this.cashfree.checkLink(this.order._id)
        .then((payment:any) => {
          this.inAppBrowser(payment.paymentLink);
        })
        .catch(err => {
        })
    }
  }


  inAppBrowser(link) {
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






}



