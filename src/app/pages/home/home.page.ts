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


  inAppBrowser() {
    const options: InAppBrowserOptions = {
      zoom: "no",
      fullscreen: "yes",
      hidenavigationbuttons: "no",
      toolbar: "no",
      hideurlbar: "yes",
    };
    const browser = this.iab.create('http://localhost:8100/tabs/tab3', '_blank', {
      toolbar: "yes",
      hideurlbar: "yes",
      fullscreen: "yes",
      location: "no",
      closebuttoncolor:'danger',
      closebuttoncaption:'close',

      options,
    });
    
    browser.on('loadstop')
      .subscribe(event => {
        console.log(event)
          })
  }

  /**injectForm() {
    let data = {
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

    var script = 'var form = document.createElement("form");';
    script += 'var url = "https://test.cashfree.com/billpay/checkout/post/submit";'; 
    script += 'form.method="post"';
    script += 'form.setAttribute("action",url);';
    script += 'form.setAttribute("id","redirectForm");';
    for (var field in data) {
      script += 'var hiddenField = document.createElement("input");';
      script += 'hiddenField.setAttribute("type", "hidden");';
      script += 'hiddenField.setAttribute("name","' + field + '");';
      script += 'hiddenField.setAttribute("value","' + data[field] + '");';
      script += 'form.appendChild(hiddenField);';
    }
    script += 'var hiddenField = document.createElement("input");';
    script += 'hiddenField.setAttribute("type", "hidden");';
    script += 'hiddenField.setAttribute("name","signature");';
    script += 'hiddenField.setAttribute("value","' + this.sortData() + '");';
    script += 'form.appendChild(hiddenField);';

    script += 'document.body.appendChild(form);';
    script += 'form.submit();';
    console.log(script);
    return script;
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
  }**/

}
