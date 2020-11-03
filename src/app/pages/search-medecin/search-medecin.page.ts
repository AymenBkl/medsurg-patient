import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AuthService } from '../../services/auth.service';
import { NavController , ModalController } from '@ionic/angular';
import { SearchMedecinService } from '../../services/search/search-medecin.service';
import { InteractionService } from '../../services/interaction.service';
import { SearchProduct } from 'src/app/interfaces/searchproduct';
import * as underscore from 'underscore';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-search-medecin',
  templateUrl: './search-medecin.page.html',
  styleUrls: ['./search-medecin.page.scss'],
})
export class SearchMedecinPage implements OnInit {

  currentUser: User;
  searchProduct: any;
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

  goPharmacyDetail(product) {

  }

  calculateTotal(){
    return new Observable((obvserver) => {
      let total = 0;
      // tslint:disable-next-line: forin
      console.log(this.searchProduct.length);
      for (var i = 0; i < this.searchProduct.length;i++){
        console.log(i);
        this.searchProduct[i].pharmacy.categories.forEach(category => {
          category.category.products.product.forEach(prod => {
              total += prod.price;
          });
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

}
