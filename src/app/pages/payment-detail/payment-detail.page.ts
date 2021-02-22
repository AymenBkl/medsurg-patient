import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateMedsurgService } from 'src/app/services/translate.service';

@Component({
  selector: 'app-payment-detail',
  templateUrl: './payment-detail.page.html',
  styleUrls: ['./payment-detail.page.scss'],
})
export class PaymentDetailPage implements OnInit {

  currentUser: User;
  update:boolean= false;
  type:string;
  constructor(private authService: AuthService,
              public translateService: TranslateMedsurgService,
              private navParams: NavParams,
              private modalCntrl: ModalController) { }



  ngOnInit() {
    
  }

  ionViewDidEnter() {
    this.getUser();
    this.checkPaymentDetailRefund();
  }

  checkPaymentDetailRefund(){
    this.type = this.navParams.get('type');
  }

  getUser(){
    this.currentUser = this.authService.user;
  }

  paymentDetailAdded($event){
    this.getUser();
    this.update = false;
    console.log(this.update,this.currentUser);
  }

  updatePaymentDetail(){
    this.update = true;
  }

  paymentDetailSelected(){
    if (this.type && this.type == 'refund'){
      this.modalCntrl.dismiss(true);
    }
  }

}
