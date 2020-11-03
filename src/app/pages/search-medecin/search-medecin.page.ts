import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AuthService } from '../../services/auth.service';
import { NavController , ModalController } from '@ionic/angular';
import { SearchMedecinService } from '../../services/search/search-medecin.service';
@Component({
  selector: 'app-search-medecin',
  templateUrl: './search-medecin.page.html',
  styleUrls: ['./search-medecin.page.scss'],
})
export class SearchMedecinPage implements OnInit {

  currentUser: User;
  constructor(private authService: AuthService,
              private searchService: SearchMedecinService) { }

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
      this.searchService.searchProducts(medecins);
  }

  onClear(event){
    console.log(event);
  }


}
