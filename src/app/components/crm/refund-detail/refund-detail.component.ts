import { Component, OnInit } from '@angular/core';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { ModalController, NavParams } from '@ionic/angular';
import { ModalControllersOrders } from 'src/app/classes/modalController.orders';
import { Order } from 'src/app/interfaces/order';
import { User } from 'src/app/interfaces/user';
import { CashfreeService } from 'src/app/services/cashfree.service';
import { OrderService } from 'src/app/services/crm/order.service';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-refund-detail',
  templateUrl: './refund-detail.component.html',
  styleUrls: ['./refund-detail.component.scss'],
})
export class RefundDetailComponent implements OnInit {

  order: Order;
  currentUser: User;
  constructor(private navParams: NavParams) {
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.order = this.navParams.get('order');
    this.currentUser = this.navParams.get('user');
    }

  getProductNames() {
    var productNames: string[] = [];
    this.order.products.map(product => {
      productNames.push(product.product.mainProduct.name + '\n');
    })
    return productNames;
  }

  ionViewDidEnter() {
    this.getData();
  }


}
