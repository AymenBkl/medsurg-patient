import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AuthService } from '../../services/auth.service';
import { ModalController, NavController } from '@ionic/angular';
import { SearchMedecinService } from '../../services/search/search-medecin.service';
import { InteractionService } from '../../services/interaction.service';
import { SearchProduct } from 'src/app/interfaces/searchproduct';
import { ModalControllerSearch } from '../../classes/modalController.searsh';
import { ActivatedRoute, NavigationEnd,  Router } from '@angular/router';
import { MainProduct } from 'src/app/interfaces/mainProduct';
import { Observable } from 'rxjs';


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
  constructor(private authService: AuthService,
              private searchService: SearchMedecinService,
              private interactionService: InteractionService,
              private modalCntrl: ModalController,
              private router: Router,
              private route: ActivatedRoute,
              private navCntrl: NavController) {
                this.modalController = new ModalControllerSearch(modalCntrl);
               }

  ngOnInit() {
    this.getCurrentUser();
    this.getCurrentRoute();
  }

  ionViewDidEnter() {
    if (this.currentUrl == 'buy' && this.searchProduct == null){
      this.router.navigate(['/tabs/search-medecin/search/findproduct'])
    }
  }


  getCurrentUser() {
    this.currentUser = this.authService.user;
  }

  goToFindProduct(){
    this.currentUrl = "findproduct";
    this.router.navigate(['/tabs/search-medecin/search/findproduct']);
  }

  onInput(value){
    const medecins = {products : { name : value }};
    this.findProducts(medecins);
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


  async getCurrentRoute(){
    this.router.events.subscribe((val) => {
      // see also 
      if (val instanceof NavigationEnd) {
        this.currentUrl = val.url.split('/')[4];
        if (this.currentUrl && this.currentUrl.split(';')){
          this.currentUrl = this.currentUrl.split(';')[0];
        }
        console.log(this.currentUrl);
      }
  });
  await this.route.paramMap.subscribe(paramMap => {
    this.searchProduct = JSON.parse(paramMap.get('products'));
    if (this.searchProduct){
      this.sortMedecins();
    }
  })
  }


  sortMedecins() {
    this.calculateTotal()
      .subscribe((result) => {
        if (result && result === true){
          this.searchProduct.sort((a, b) => {
            return a.totalPrice - b.totalPrice;
          });
        }
      });

  }

  calculateTotal(){
    return new Observable((obvserver) => {
      let total = 0;
      let i = 0;
      while (i < this.searchProduct.length){
        if(this.searchProduct[i] == null){
          this.searchProduct.splice(i,1)
        }
        else {
        this.searchProduct[i].pharmacy.products.map(product => {
          total += product.product.price * product.quantity;

        });
        this.searchProduct[i].totalPrice = total;
        total = 0;
        i++;
        if (i === (this.searchProduct.length - 1)){
          setTimeout(() => {
            obvserver.next(true);
          }, 400);
        }
      }
    }
    });
  }


  back() {
    this.navCntrl.back();
  }

  
  
}
