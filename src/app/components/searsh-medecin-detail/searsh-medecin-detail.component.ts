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
  isPres: {prescription:string,comment:string,type:string} = null;
  constructor(private navParams: NavParams,
    private modalCntrl: ModalController) {
    this.modalControllers = new ModalControllers(modalCntrl);
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.searchProduct = this.navParams.get('product');
    this.isPres = this.navParams.get('isPres');
    this.currentUser = this.navParams.get('user');
    console.log(this.isPres);
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
        + product.product.mainProduct.name  
        + product.quantity + '\n' );
        index++;
    })
    prescriptionDetails.join()
    return prescriptionDetails;
  }


  openAddPrescription() {
    this.modalControllers.addPrescription(this.currentUser, this.constructPrescription());
  }

  addOrder() {
    this.modalControllers.callAddOrder(this.currentUser, this.searchProduct,this.isPres);
    this.modalCntrl.dismiss();
  }

}
