import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AuthService } from '../../services/auth.service';
import { ModalControllers } from '../../classes/modalController';
import { ModalController } from '@ionic/angular';
import { RealtimedatabaseService } from '../../services/firebase/realtimedatabase.service';
import { Prescription } from 'src/app/interfaces/prescription';
import { InteractionService } from '../../services/interaction.service';

@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.page.html',
  styleUrls: ['./prescription.page.scss'],
})
export class PrescriptionPage implements OnInit {

  currentUser: User;
  modalControllers: ModalControllers;
  prescriptions: Prescription[];
  constructor(private authService: AuthService,
              private modalController: ModalController,
              private realtimedatabase: RealtimedatabaseService,
              private interactionService: InteractionService) {
                this.modalControllers = new ModalControllers(modalController);
              }

  ngOnInit() {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.authService.getCurrentUser()
      .subscribe(user => {
        this.currentUser = user;
        this.getPrescription();
      });
  }

  openAddPrescription() {
    this.modalControllers.addPrescription(this.currentUser);
  }

  openEditPrescription(selectedPrescription: Prescription){
    this.modalControllers.callEditPrescription(this.currentUser, selectedPrescription);
  }

  getPrescription(){
    this.realtimedatabase.getData(this.currentUser._id)
      .subscribe((data: any) => {
        this.prescriptions = data;
        this.prescriptions.sort((a, b) => {
          return (new Date(a.date).getSeconds() - new Date(b.date).getSeconds());
        });
        console.log(this.prescriptions);
      }, err => {
        this.interactionService.createToast('Something went wrong', 'danger', 'bottom');
      });
  }
}
