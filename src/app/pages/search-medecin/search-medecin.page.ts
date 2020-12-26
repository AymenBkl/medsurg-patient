import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AuthService } from '../../services/auth.service';
import { ModalController } from '@ionic/angular';
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
              private route: ActivatedRoute) {
                this.modalController = new ModalControllerSearch(modalCntrl);
               }

  ngOnInit() {
    this.getCurrentUser();
    this.getCurrentRoute();
  }

  ionViewDidEnter() {
    console.log("entred");
    setTimeout(() => {
      console.log("user",this.searchProduct);
    },3000)
  }


  getCurrentUser() {
    this.authService.getCurrentUser()
      .subscribe(user => {
        this.currentUser = user;
      });
  }

  onInput(value){
    this.router.navigate(['/search-medecin/search/findproduct']);
    this.currentUrl = "findproduct";
    const medecins = {products : { name : value }};
    console.log(medecins);
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


  getCurrentRoute(){
    this.router.events.subscribe((val) => {
      // see also 
      if (val instanceof NavigationEnd) {
        this.currentUrl = val.url.split('/')[3];
        if (this.currentUrl.split(';')){
          this.currentUrl = this.currentUrl.split(';')[0];
        }
        console.log(this.currentUrl);
      }
  });
  this.route.paramMap.subscribe(paramMap => {
    this.searchProduct = JSON.parse(paramMap.get('products'))
  })
  }

  
  
}
