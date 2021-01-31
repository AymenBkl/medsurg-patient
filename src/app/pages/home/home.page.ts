import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { config } from 'src/app/services/config';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { CashfreeService } from 'src/app/services/cashfree.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  currentUser:User;
  data = {
    "appId": config.cashfree.appId,
    "orderId": 'ORDER-15326',
    "orderAmount": "150",
    "orderCurrency": 'INR',
    "orderNote": "TEST",
    "customerName": "AYMEN BKL",
    "customerPhone": '9177091554',
    "customerEmail": 'sada@sada.dz',
    "returnUrl": 'http://localhost:8100/orders',
    "notifyUrl": 'http://localhost:8100/orders',
  };
  constructor(private authService: AuthService,
              private iab: InAppBrowser,
              private cashfree: CashfreeService) { }

  ngOnInit() {
  }

  getCurrentUser() {
    this.currentUser = this.authService.user;
  }

  ionViewDidEnter(){
    this.getCurrentUser();
  }


}
