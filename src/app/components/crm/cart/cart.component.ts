import { Component, Input, OnInit,} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CartProduct } from 'src/app/interfaces/cartProduct';
import { MainProduct } from 'src/app/interfaces/mainProduct';
import { Product } from 'src/app/interfaces/product';
import { SearchProduct } from 'src/app/interfaces/searchproduct';
import { User } from 'src/app/interfaces/user';
import { InteractionService } from 'src/app/services/interaction.service';
import { SearchMedecinService } from 'src/app/services/search/search-medecin.service';
import { StorageService } from 'src/app/services/storage.service';
import { ModalControllers } from '../../../classes/modalController';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {

  searchProduct: SearchProduct[];
  productsKeys: CartProduct[];
  modalControllers: ModalControllers;
  currentUser: User;
  selectedProduct: number;
  cartProducts: CartProduct[];
  cartProduct: {};
  constructor(private router: Router,
              private storageService: StorageService,
              private interactionService: InteractionService,
              private searchService: SearchMedecinService) {
              }

  ngOnInit() {
    this.getAllCartProducts();
    this.getCurrentRoute();
  }
  getAllCartProducts(){
    
    this.storageService.getAllCartProduct()
      .then((cartProducts) => {
        this.cartProducts = Object.values(cartProducts);
        this.cartProduct = cartProducts;
      });
  }

  add(cartProduct: CartProduct){
    cartProduct.quantity += 1;
    this.cartProduct[cartProduct.mainProduct._id] = cartProduct;
    this.storageService.quntityModifiedCart(this.cartProduct);
  }

  remove(cartProduct: CartProduct){
    if (cartProduct.quantity > 1){
      cartProduct.quantity -= 1 ;
      this.cartProduct[cartProduct.mainProduct._id] = cartProduct;
      this.storageService.quntityModifiedCart(this.cartProduct);
    }
    else if (cartProduct.quantity == 1){
      this.removeMedecin(cartProduct)
    }
    
  }

  removeMedecin(cartProduct: CartProduct){
    this.interactionService.alertWithHandler('Do you want to delete this medecin from cart', 'ALERT', 'KEEP', 'DELETE')
      .then((result) => {
        if (result && result == true){
          this.storageService.removeMedecin(this.cartProduct,cartProduct);
          this.cartProducts.splice(this.cartProducts.indexOf(cartProduct),1) 
        }
      })
  }

  findPharmacies() {
    let productsname : {products: any[]} = {products: []};
    this.cartProducts.map(cartProduct => {
      productsname.products.push({name: cartProduct.mainProduct.name});
    })
    this.searchProducts(productsname);
  }

  addPrescription(){

  }

  searchProducts(medecins) {
    this.interactionService.createLoading('Getting your Result !')
      .then(() => {
        this.searchService.searchProducts(medecins)
          .then((products: SearchProduct | any) => {
            this.interactionService.hide();
            if (products && products !== false){
              this.searchProduct = products;
              this.addQuantity();
              this.router.navigate(['/search-medecin/search/buy',{products: JSON.stringify(this.searchProduct)}]);
            }
            else {
              this.interactionService.createToast('Not Found', 'danger', 'bottom');
            }
          })
          .catch(err => {
            this.interactionService.hide();
            console.log(err);
            this.interactionService.createToast('Something Went Wrong ! Try Again', 'danger', 'bottom');
          });
      });
  }


  async addQuantity(){
      await this.searchProduct.map(searchProd => {
        searchProd.pharmacy.products.map(prod => {
          prod.quantity = this.cartProduct[prod.product.mainProduct._id].quantity;
        })
      })
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