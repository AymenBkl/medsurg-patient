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

  constructPrescription() {
    var prescriptionDetails: string[] = [];
    let index = 1;
    this.searchProduct.pharmacy.products.map(product => {
      prescriptionDetails.push(
        index + ' - ' 
        + product.product.mainProduct.name + ',IGST : ' 
        + product.product.mainProduct.igst + ',SGST : ' 
        + product.product.mainProduct.sgst + ', CGST:' 
        + product.product.mainProduct.cgst + ' X ' 
        + product.quantity + '\n');
        index++;
    })
    return prescriptionDetails;
  }


  openAddPrescription() {
    this.modalControllers.addPrescription(this.currentUser, this.constructPrescription());
  }

  addOrder() {
    this.modalControllers.callAddOrder(this.currentUser, this.searchProduct);
    this.modalCntrl.dismiss();
  }

}
