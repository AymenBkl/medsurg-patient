import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AuthService } from '../../services/auth.service';
import { ModalControllers } from '../../classes/modalController';
import { ModalController } from '@ionic/angular';
import { RealtimedatabaseService } from '../../services/firebase/realtimedatabase.service';
import { Prescription } from 'src/app/interfaces/prescription';
import { InteractionService } from '../../services/interaction.service';
import { map } from 'rxjs/operators';

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
        this.buildPrescription();
      });
  }

  openAddPrescription() {
    this.modalControllers.addPrescription(this.currentUser);
  }

  openEditPrescription(selectedPrescription: Prescription){
    this.modalControllers.callEditPrescription(this.currentUser, selectedPrescription);
  }

  getPrescription(){
    return this.realtimedatabase.getData(this.currentUser._id)
    .pipe(map( action => action
      .map((a: any) => {
        const val = a.payload.val();
        const data = {
        key: a.payload.key,
        user_id: val.user_id,
        userFullName: val.userFullName,
        description: val.description,
        date: val.date,
        imageUrl: val.imageUrl
        };
        return  data;
      })));
  }



  buildPrescription(){
    this.getPrescription().
    subscribe((data: any) => {
      if (data.length === 0 ){
        this.interactionService.createToast('No data found', 'primary', 'bottom');
      }
      else {
        this.prescriptions = data;
        this.prescriptions.sort((a, b) => {
          return new Date(b.date).getUTCMilliseconds() - new Date(a.date).getUTCMilliseconds();
        });
      }
    });
  }

}
