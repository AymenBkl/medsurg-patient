import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AuthService } from '../../../services/auth.service';
import { ModalControllers } from '../../../classes/modalController';
import { ModalController } from '@ionic/angular';
import { RealtimedatabaseService } from '../../../services/firebase/realtimedatabase.service';
import { Prescription } from 'src/app/interfaces/prescription';
import { InteractionService } from '../../../services/interaction.service';
import { map } from 'rxjs/operators';

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
    private realtimedatabase: RealtimedatabaseService,
    private interactionService: InteractionService) {
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
    this.realtimedatabase.getData(this.currentUser._id).
    subscribe((data: any) => {
      const prescriptions = [];
      if (data.length === 0 ){
        this.interactionService.createToast('No data found', 'primary', 'bottom');
      }
      else {
        data.map(presc => {
          prescriptions.push(presc);
        });
        this.prescriptions = prescriptions.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
      }
    });
  }

}
