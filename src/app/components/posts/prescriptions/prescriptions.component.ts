import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AuthService } from '../../../services/auth.service';
import { ModalControllers } from '../../../classes/modalController';
import { ModalController } from '@ionic/angular';
import { Prescription } from 'src/app/interfaces/prescription';
import { InteractionService } from '../../../services/interaction.service';
import { map } from 'rxjs/operators';
import { PrescriptionService } from 'src/app/services/prescription.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateMedsurgService } from 'src/app/services/translate.service';

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
    private prescriptionService: PrescriptionService,
    public translateService:TranslateMedsurgService) {
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
    setTimeout(() => {
      this.prescriptionService.getAllPrescriptions().
      then(async (data: any) => {
        console.log(data);
        if (data.length === 0 ){
          this.prescriptions = [];
          this.interactionService.createToast('TOAST_PRESCRIPTION_NOTFOUND', 'primary', 'bottom');
        }
        else {
          this.prescriptions = data.sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
        }
      })
      .catch(err => {
        this.prescriptions = [];
        this.interactionService.createToast('TOAST_ERROR', 'danger', 'bottom');
      });
    },3000)
    
  }

}
