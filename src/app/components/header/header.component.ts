import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AuthService } from '../../services/auth.service';
import { NavController , ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  // tslint:disable-next-line: no-input-rename
  @Input('type') type:string;
  @Input('page') page:string;
  currentUser: User;
  constructor(private authService: AuthService,
              private navCntrl: NavController,
              private modalCntrl: ModalController,
              private router: Router) { }

  ngOnInit() {
    this.getCurrentUser();
    console.log(this.type);
  }


  getCurrentUser() {
    this.authService.getCurrentUser()
      .subscribe(user => {
        this.currentUser = user;
      });
  }

  back() {
    this.navCntrl.back();
  }

  close(){
    this.modalCntrl.dismiss(null);
  } 

  logOut(){
    this.authService.logOut()
      .then(() => {
        this.router.navigate(['/login']);
      }).catch(() => {
        this.router.navigate(['/login']);
      });
  }

  goToCart(){
    this.router.navigate(['/tabs/search-medecin/search/cart']);
  }

  goToFindProduct(){
    this.router.navigate(['/tabs/search-medecin/search/findproduct']);
  }

}
