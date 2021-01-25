import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Platform } from '@ionic/angular';
import { CashfreeService } from 'src/app/services/cashfree.service';
import { config } from 'src/app/services/config';
declare var cordova: any;

@Component({
  selector: 'app-cashfree',
  templateUrl: './cashfree.page.html',
  styleUrls: ['./cashfree.page.scss'],
})

export class CashfreePage implements OnInit {

  data = {
    "appId": config.cashfree.appId,
    "orderId": 'ORDER-1532610sssss1sssss1s1',
    "orderAmount": "150",
    "orderCurrency": 'INR',
    "orderNote": "TEST",
    "customerName": "AYMEN BKL",
    "customerPhone": '9177091554',
    "customerEmail": 'sada@sada.dz',
    "returnUrl": config.baseURL + "crm/orders/createreorder" ,
  };
  @ViewChild('redirectForm') form: ElementRef;
  sign: any;
  constructor(private cashfree: CashfreeService,
              private platform: Platform) { }

  ngOnInit() {

    this.startPayment();
  }

  ionViewDidEnter() {
    //this.form.nativeElement.submit();

  }

  startPayment(){
    this.platform.ready().then(() => {
      console.log("ready");
      var params = {
        "appId":config.cashfree.appId,
        "orderId":config.cashfree.appKey,
        "orderAmount":'150',
        "orderNote":"TEST",
        "customerName":"Aymen BKL",
        "customerPhone":'9177091554',
        "customerEmail":"sadadsa",
        "stage":"TEST/PROD",
        }
     this.cashfree.createToken(params)
      .then(((result:any) => {
        console.log(result,"llll");
        params['tokenData'] = result.cftoken; 
        console.log(params);
        cordova.exec(function(success) {
                 
        },  //Success callback
        function(error) {
        
        }, // Error Callback
        "PgCordovaWrapper",                      
        "startPaymentWEB",    
        [params]); 
      }));
     
    })
    
  }

}
