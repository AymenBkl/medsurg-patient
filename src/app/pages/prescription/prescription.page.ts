import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AuthService } from '../../services/auth.service';
import { ModalControllers } from '../../classes/modalController';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.page.html',
  styleUrls: ['./prescription.page.scss'],
})
export class PrescriptionPage implements OnInit {

  currentUser: User;
  modalControllers: ModalControllers;
  constructor(private authService: AuthService,
              private modalController: ModalController) { 
                this.modalControllers = new ModalControllers(modalController);
              }

  ngOnInit() {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.authService.getCurrentUser()
      .subscribe(user => {
        this.currentUser = user;
      });
  }

  openAddPrescription() {
    this.modalControllers.addPrescription(this.currentUser);
  }


}
