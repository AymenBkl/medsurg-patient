import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AuthService } from '../../services/auth.service';
import { ModalControllers } from '../../classes/modalController';
import { ModalController } from '@ionic/angular';
import { RealtimedatabaseService } from '../../services/firebase/realtimedatabase.service';
import { Prescription } from 'src/app/interfaces/prescription';
import { InteractionService } from '../../services/interaction.service';
import { map } from 'rxjs/operators';
import { Comment } from '../../interfaces/comment';
import { Offer } from 'src/app/interfaces/offer';
import { PrescriptionService } from 'src/app/services/prescription.service';
@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.page.html',
  styleUrls: ['./prescription.page.scss'],
})
export class PrescriptionPage implements OnInit {

  currentUser: User;
  modalControllers: ModalControllers;
  prescriptions: Prescription[] = [];
  currentSegmentType: string = 'prescriptions';
  offers: Offer[] | any;
  constructor(private authService: AuthService,
              private modalController: ModalController,
              private realtimedatabase: RealtimedatabaseService,
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
    this.getOffers();

  }

  openAddPrescription() {
    this.modalControllers.addPrescription(this.currentUser,[]);
  }

  openEditPrescription(selectedPrescription: Prescription){
    this.modalControllers.callEditPrescription(this.currentUser, selectedPrescription);
  }

  buildPrescription(){
    this.prescriptionService.getAllPrescriptions().
    then((data: any) => {
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


  getOffers(){
    this.realtimedatabase.getOffers(this.currentUser._id)
      .subscribe(offers => {
        this.offers = offers
      });
  }

  segmentChanged(event){
    this.currentSegmentType = event.detail.value;
  }
  

}
