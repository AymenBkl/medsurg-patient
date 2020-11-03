import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AuthService } from '../../services/auth.service';
import { NavController , ModalController } from '@ionic/angular';
import { SearchMedecinService } from '../../services/search/search-medecin.service';
import { InteractionService } from '../../services/interaction.service';
@Component({
  selector: 'app-search-medecin',
  templateUrl: './search-medecin.page.html',
  styleUrls: ['./search-medecin.page.scss'],
})
export class SearchMedecinPage implements OnInit {

  currentUser: User;
  searchProduct;
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
      const medecins = {products : value.split(',').map(med => {return ({ name : med })})};
      console.log(medecins);
      this.searchProducts(medecins);
  }

  searchProducts(medecins) {
    this.interactionService.createLoading('Getting your Result !')
      .then(() => {
        this.searchService.searchProducts(medecins)
          .then(products => {
            this.interactionService.hide();
            if (products && products !== false){
              console.log(products);
              this.searchProduct = products;
            }
            else {
              this.interactionService.createToast('Something Went Wrong ! Try Again', 'danger', 'bottom');
            }
          })
          .catch(err => {
            this.interactionService.hide();
            this.interactionService.createToast(err, 'danger', 'bottom');
          });
      });
  }

  goPharmacyDetail(product) {

  }

}
