import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AuthService } from '../../services/auth.service';
import { NavController , ModalController } from '@ionic/angular';
import { SearchMedecinService } from '../../services/search/search-medecin.service';
import { InteractionService } from '../../services/interaction.service';
import { SearchProduct } from 'src/app/interfaces/searchproduct';
import { SearchResponse } from '../../interfaces/responseSearch';

@Component({
  selector: 'app-search-medecin',
  templateUrl: './search-medecin.page.html',
  styleUrls: ['./search-medecin.page.scss'],
})
export class SearchMedecinPage implements OnInit {

  currentUser: User;
  searchProduct: SearchProduct;
  constructor(private authService: AuthService,
              private searchService: SearchMedecinService,
              private interactionService: InteractionService) { }

  ngOnInit() {
    this.getCurrentUser();
  }


  getCurrentUser() {
    this.authService.getCurrentUser()
      .subscribe(user => {
        this.currentUser = user;
      });
  }

  onInput(value){
      const medecins = {products : value.split(',').map(med => {return ({ name : med });})};
      console.log(medecins);
      this.searchProducts(medecins);
  }

  searchProducts(medecins) {
    this.interactionService.createLoading('Getting your Result !')
      .then(() => {
        this.searchService.searchProducts(medecins)
          .then((products: SearchProduct | any) => {
            this.interactionService.hide();
            if (products && products !== false){
              console.log(products);
              this.searchProduct = products;
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

  goPharmacyDetail(product) {

  }

  calculateTotal(product: SearchProduct){
    let total = 0;
    product.pharmacy.categories.forEach(category => {
      category.category.products.product.forEach(prod => {
          total += prod.price;
      });
    });
    console.log(total);
    return total;
  }

}
