import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalControllers } from '../classes/modalController';
import { User } from '../interfaces/user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  modalControllers: ModalControllers;
  currentUser:User;
  constructor(private modalCntrl: ModalController,
              private authService: AuthService) {
    this.currentUser = this.authService.user;
    this.modalControllers = new ModalControllers(modalCntrl);
  }

  callPrescription(){
    this.modalControllers.addPrescription(this.currentUser, []);
  }

}
