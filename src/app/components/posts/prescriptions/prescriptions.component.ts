import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AuthService } from '../../../services/auth.service';
import { ModalControllers } from '../../../classes/modalController';
import { ModalController } from '@ionic/angular';
import { Prescription } from 'src/app/interfaces/prescription';
import { InteractionService } from '../../../services/interaction.service';
import { map } from 'rxjs/operators';
import { PrescriptionService } from 'src/app/services/prescription.service';

@Component({
  selector: 'app-prescriptions',
  templateUrl: './prescriptions.component.html',
  styleUrls: ['./prescriptions.component.scss'],
})
export class PrescriptionsComponent implements OnInit {

  currentUser: User;
  modalControllers: ModalControllers;
  prescriptions: Prescription[];
  sliderConfig = {
    slidesPerView: 2.2,
    spaceBetween: 0,
    autoplay: true
  };
  constructor(private authService: AuthService,
    private modalController: ModalController,
    private interactionService: InteractionService,
    private prescriptionService: PrescriptionService) {
    this.modalControllers = new ModalControllers(modalController);
  }

  ngOnInit() {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.currentUser = this.authService.user;
    this.buildPrescription();
  }
  openAddPrescription() {
    this.modalControllers.addPrescription(this.currentUser, []);
  }

  openEditPrescription(selectedPrescription: Prescription) {
    this.modalControllers.callEditPrescription(this.currentUser, selectedPrescription);
  }




  buildPrescription(){
    this.prescriptions = [];
    this.prescriptionService.getAllPrescriptions().
        then(async (data: any) => {
          console.log(data);
          if (data.length === 0 ){
            this.interactionService.createToast('No data found', 'primary', 'bottom');
          }
          else {
            this.prescriptions = data.sort((a, b) => {
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
          }
        })
        .catch(err => {
          this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
        });
  }

}
