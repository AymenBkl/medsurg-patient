import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { SearchProduct } from 'src/app/interfaces/searchproduct';
import { User } from 'src/app/interfaces/user';
import { ModalControllers } from '../../classes/modalController';

@Component({
  selector: 'app-searsh-medecin-detail',
  templateUrl: './searsh-medecin-detail.component.html',
  styleUrls: ['./searsh-medecin-detail.component.scss'],
})
export class SearshMedecinDetailComponent implements OnInit {

  searchProduct: SearchProduct;
  modalControllers: ModalControllers;
  currentUser: User;
  constructor(private navParams: NavParams,
              private modalCntrl: ModalController) {
                this.modalControllers = new ModalControllers(modalCntrl);
              }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.searchProduct = this.navParams.get('product');
    this.currentUser = this.navParams.get('user');
  }

  goAddPrescription() {
    this.openAddPrescription();
  }

  getProductNames() {
    var productNames : string[] = [];
    this.searchProduct.pharmacy.products.map(product => {
      productNames.push(product.mainProduct.name + '\n');
    })
    return productNames;
  }


  openAddPrescription() {
    this.modalControllers.addPrescription(this.currentUser,this.getProductNames());
  }

  addOrder() {
    this.modalControllers.callAddOrder(this.currentUser,this.searchProduct);
    this.modalCntrl.dismiss();
  }

}
