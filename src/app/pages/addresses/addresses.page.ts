import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.page.html',
  styleUrls: ['./addresses.page.scss'],
})
export class AddressesPage implements OnInit {

  currentUser: User;
  addAddress: boolean = false;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.getCurrentUser();
  }

  getCurrentUser(){
    this.currentUser = this.authService.user;
    console.log(this.currentUser);
  }

  goToAddAddress(){
    this.addAddress = true;
  }

  addressAdded(event) {
    console.log(event);
    this.addAddress = event;
    this.getCurrentUser();
  }

}
