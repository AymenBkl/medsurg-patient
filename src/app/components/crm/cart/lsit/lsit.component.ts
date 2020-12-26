
import { Component, Input, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
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
  cartProducts: {} = {};
  constructor(private router: Router,
              private storageService: StorageService) {
              }

  ngOnInit() {
    this.getAllCartProducts();
    this.getCurrentRoute();
  }


 

  addToCart() {
    this.cartProducts[this.products[this.selectedProduct]._id] = {mainProduct:this.products[this.selectedProduct],quantity:1};
    this.storageService.addToCart(this.cartProducts);
    this.selectedProduct = null;
    this.products = [];
  }

  selectProduct(index){
    this.selectedProduct = index;
  }

  goToCart(){
    this.router.navigate(['/search-medecin/search/cart'])
  }

  getAllCartProducts(){
    this.storageService.getAllCartProduct()
      .then((cartProducts) => {
        if (cartProducts != null){
          this.cartProducts = cartProducts;
        }
        console.log(cartProducts);
      });
  }

  getCurrentRoute(){
    this.router.events.subscribe((val) => {
      // see also 
      if (val instanceof NavigationEnd) {
          this.getAllCartProducts();
        }
      
  });
  }

}




