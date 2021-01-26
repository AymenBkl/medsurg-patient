import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { MainProduct } from 'src/app/interfaces/mainProduct';
import { SearchProduct } from 'src/app/interfaces/searchproduct';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/crm/category.service';
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
  selectedProduct: number;
  emptyCartProduct:boolean;
  cartProducts: {} = {};
  categorieId: string;
  initMainProducts:MainProduct[];
  searchProduct: MainProduct[];
  constructor(private authService: AuthService,
              private navCntrl: NavController,
              private storageService: StorageService,
              private router: Router,
              private interactionService: InteractionService,
              private searchService: SearchMedecinService,
              private categorieService: CategoryService,
              private activatedRoute: ActivatedRoute ) { }

  ngOnInit() {
    this.getCurrentCategoryId();

  }

  ionViewDidEnter() {
    this.getCurrentUser();
    this.getAllCartProducts();
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
    this.cartProducts[this.searchProduct[this.selectedProduct]._id] = {mainProduct:this.searchProduct[this.selectedProduct],quantity:1};
    this.storageService.addToCart(this.cartProducts);
    this.selectedProduct = null;
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
    const medecin = value;
    this.findProducts(medecin);
  }

  findProducts(medecin: string) {
    this.searchProduct = this.initMainProducts.filter(product => 
      product.name && product.name.toLowerCase().includes(medecin.toLowerCase())
    )
  }


  getCurrentCategoryId(){
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.categorieId = this.router.getCurrentNavigation().extras.state.categorieId;
        this.getAllMedecinsInCategorie();
      }
    });
  }

  getAllMedecinsInCategorie(){
    this.interactionService.createLoading('Getting your Products !')
      .then(() => {
        this.categorieService.getCategory(this.categorieId)
        .then((result: any) => {
          this.interactionService.hide();
          console.log(result);
          if (result && result != false){
            this.interactionService.createToast('Products Loaded', 'success', 'bottom');
            this.initMainProducts = result.products;
            this.searchProduct = result.products;
          }
          else {
            this.interactionService.createToast('Their is no Products in this category', 'primary', 'bottom');
          }
        })
        .catch(err => {
          this.interactionService.hide();
          console.log(err);
          this.interactionService.createToast('Something Went Wrong ! Try Again', 'danger', 'bottom');
        })
      })
    
  }

  

}
