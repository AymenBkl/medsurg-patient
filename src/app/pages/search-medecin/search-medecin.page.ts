import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AuthService } from '../../services/auth.service';
import { NavController , ModalController } from '@ionic/angular';
import { SearchMedecinService } from '../../services/search/search-medecin.service';
import { InteractionService } from '../../services/interaction.service';
import { SearchProduct } from 'src/app/interfaces/searchproduct';
import { Observable } from 'rxjs';
import {  RealtimedatabaseService } from '../../services/firebase/realtimedatabase.service';
import { ModalControllerSearch } from '../../classes/modalController.searsh';
import { Product } from 'src/app/interfaces/product';
import { ActivatedRoute, NavigationEnd, ParamMap, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { MainProduct } from 'src/app/interfaces/mainProduct';
import { StorageService } from 'src/app/services/storage.service';


@Component({
  selector: 'app-search-medecin',
  templateUrl: './search-medecin.page.html',
  styleUrls: ['./search-medecin.page.scss'],
})
export class SearchMedecinPage implements OnInit {

  currentUser: User;
  searchProduct: SearchProduct[];
  modalController: ModalControllerSearch;
  products: MainProduct[] = [];
  currentUrl: string;
  cartProducts: MainProduct[];
  constructor(private authService: AuthService,
              private searchService: SearchMedecinService,
              private interactionService: InteractionService,
              private realtimedatabase: RealtimedatabaseService,
              private modalCntrl: ModalController,
              private router: Router,
              private storageService: StorageService) {
                this.modalController = new ModalControllerSearch(modalCntrl);
               }

  ngOnInit() {
    this.getCurrentUser();
    this.getCurrentRoute();
  }


  getCurrentUser() {
    this.authService.getCurrentUser()
      .subscribe(user => {
        this.currentUser = user;
      });
  }

  onInput(value){
    const medecins = {products : { name : value }};
    console.log(medecins);
    this.findProducts(medecins);
  }

  searchProducts(medecins) {
    this.interactionService.createLoading('Getting your Result !')
      .then(() => {
        this.searchService.searchProducts(medecins)
          .then((products: SearchProduct | any) => {
            this.interactionService.hide();
            if (products && products !== false){
              this.searchProduct = products;
              this.sortMedecins();
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

  findProducts(medecins) {
    this.interactionService.createLoading('Getting your Result !')
      .then(() => {
        this.searchService.findProduct(medecins)
          .then((products: SearchProduct | any) => {
            this.interactionService.hide();
            if (products && products !== false){
              this.products = products
            }
            else {
              this.interactionService.createToast('Not Found', 'danger', 'bottom');
            }
          })
          .catch(err => {
            this.interactionService.hide();            
            this.interactionService.createToast('Something Went Wrong ! Try Again', 'danger', 'bottom');
          });
      });
  }

  goPharmacyDetail(selectedPharmacy: SearchProduct) {
    this.modalController.callSearchDetail(selectedPharmacy,this.currentUser)

  }

  calculateTotal(){
    return new Observable((obvserver) => {
      let total = 0;
      // tslint:disable-next-line: forin
      console.log(this.searchProduct[0].pharmacy.products);
      for (var i = 0; i < this.searchProduct.length;i++){
        console.log(i);
        
        this.searchProduct[i].pharmacy.products.map(product => {
          total += product.price;

        });
        this.searchProduct[i].totalPrice = total;
        total = 0;
        if (i === (this.searchProduct.length - 1)){
          setTimeout(() => {
            obvserver.next(true);
          }, 1000);
        }
      }
    });
  }

  sortMedecins() {
    this.calculateTotal()
      .subscribe((result) => {
        console.log(result);
        if (result && result === true){
          this.searchProduct.sort((a, b) => {
            return a.totalPrice - b.totalPrice;
          });
          console.log(this.searchProduct);
        }
      });

  }


  getCurrentRoute(){
    this.router.events.subscribe((val) => {
      // see also 
      if (val instanceof NavigationEnd) {
        this.currentUrl = val.url.split('/')[3];
      }
  });
  }

  
  
}
