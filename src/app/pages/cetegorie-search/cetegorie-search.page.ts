import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { MainProduct } from 'src/app/interfaces/mainProduct';
import { SearchProduct } from 'src/app/interfaces/searchproduct';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { InteractionService } from 'src/app/services/interaction.service';
import { SearchMedecinService } from 'src/app/services/search/search-medecin.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-cetegorie-search',
  templateUrl: './cetegorie-search.page.html',
  styleUrls: ['./cetegorie-search.page.scss'],
})
export class CetegorieSearchPage implements OnInit {

  currentUser: User;
  products: MainProduct[];
  selectedProduct: number;
  emptyCartProduct:boolean;
  cartProducts: {} = {};
  categorieId: string;
  constructor(private authService: AuthService,
              private navCntrl: NavController,
              private storageService: StorageService,
              private router: Router,
              private interactionService: InteractionService,
              private searchService: SearchMedecinService,
              private activatedRoute: ActivatedRoute ) { }

  ngOnInit() {
    this.getCurrentUser();
    this.getAllCartProducts();
    this.getCurrentCategoryId();
  }

  getCurrentUser() {
    this.currentUser = this.authService.user;
  }

  back() {
    this.navCntrl.back();
  }

  selectProduct(index){
    this.selectedProduct = index;
  }

  addToCart() {
    this.cartProducts[this.products[this.selectedProduct]._id] = {mainProduct:this.products[this.selectedProduct],quantity:1};
    this.storageService.addToCart(this.cartProducts);
    this.selectedProduct = null;
    this.products = [];
    this.emptyCartProduct = false;
  }

  getAllCartProducts(){
    this.storageService.getAllCartProduct()
      .then((cartProducts) => {
        if (cartProducts != null &&  Object.keys(cartProducts).length != 0){
          this.emptyCartProduct = false;
          this.cartProducts = cartProducts;
        }
        else {
          this.emptyCartProduct = true;
        }
      });
  }

  goToCart(){
    this.router.navigate(['/tabs/search-medecin/search/cart'])
  }

  onInput(value){
    const medecins = {products : { name : value }};
    this.findProducts(medecins);
  }

  findProducts(medecins) {
    this.interactionService.createLoading('Getting your Result !')
      .then(() => {
        console.log(this.categorieId);
        this.searchService.findProductCategory(medecins,this.categorieId)
          .then((products: SearchProduct | any) => {
            this.interactionService.hide();
            if (products && products !== false){
              this.products = products
            }
            else {
              this.products = [];
              this.interactionService.createToast('Not Found', 'danger', 'bottom');
            }
          })
          .catch(err => {
            this.interactionService.hide();            
            this.interactionService.createToast('Something Went Wrong ! Try Again', 'danger', 'bottom');
          });
      });
  }


  getCurrentCategoryId(){
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.categorieId = this.router.getCurrentNavigation().extras.state.categorieId;
      }
    });
  }

  

}
