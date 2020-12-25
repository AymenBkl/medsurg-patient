
import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { CartProduct } from 'src/app/interfaces/cartProduct';
import { MainProduct } from 'src/app/interfaces/mainProduct';
import { Product } from 'src/app/interfaces/product';
import { SearchProduct } from 'src/app/interfaces/searchproduct';
import { User } from 'src/app/interfaces/user';
import { StorageService } from 'src/app/services/storage.service';
import { ModalControllers } from '../../../../classes/modalController';

@Component({
  selector: 'app-lsit',
  templateUrl: './lsit.component.html',
  styleUrls: ['./lsit.component.scss'],
})
export class LsitComponent implements OnInit {

  @Input('product') products: MainProduct[];
  modalControllers: ModalControllers;
  currentUser: User;
  selectedProduct: number;
  cartProducts: CartProduct[];
  constructor(private navParams: NavParams,
              private storageService: StorageService) {
              }

  ngOnInit() {
    this.getAllCartProducts();
  }

 

  addToCart() {
    this.storageService.addToCart(this.cartProducts,this.products[this.selectedProduct]);
    this.cartProducts.push({mainProduct:this.products[this.selectedProduct],quantity:1});
    this.products = [];
  }

  selectProduct(index){
    this.selectedProduct = index;
  }

  getAllCartProducts(){
    this.storageService.getAllCartProduct()
      .then((cartProducts) => {
        console.log(cartProducts);
        if (cartProducts || cartProducts == null){
          this.cartProducts = [];
        }
        else {
          this.cartProducts = cartProducts;
        }
      });
  }

}




