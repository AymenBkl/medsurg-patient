import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Address } from 'src/app/interfaces/address';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateMedsurgService } from 'src/app/services/translate.service';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.page.html',
  styleUrls: ['./addresses.page.scss'],
})
export class AddressesPage implements OnInit {

  currentUser: User;
  addAddress: boolean = false;
  isOrder:boolean = false;
  selectedAddress: number;
  constructor(private authService: AuthService,
              private navParams: NavParams,
              private modalCntrl: ModalController,
              public translateService: TranslateMedsurgService) { }

  ngOnInit() {
    this.checkIfIsOrder();
    this.getCurrentUser();
  }

  checkIfIsOrder() {
    if (this.navParams.get('order') && this.navParams.get('order') == true){
      this.isOrder = true;
    }
    else {
      this.isOrder = false;
    }
  }
  getCurrentUser(){
    this.currentUser = this.authService.user;
    console.log(this.currentUser);
  }

  goToAddAddress(){
    this.addAddress = true;
  }

  addressAdded(event) {
    console.log(event);
    this.addAddress = event;
    this.getCurrentUser();
  }

  selectAddress(index: number){
    console.log(index);
    if (this.isOrder){
      this.selectedAddress = index + 1;
    }
  }

  selectedAddressOrder(){
    this.modalCntrl.dismiss(this.currentUser.addresses[this.selectedAddress-1]);
  }

}
