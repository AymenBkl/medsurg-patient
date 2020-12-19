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
@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.page.html',
  styleUrls: ['./prescription.page.scss'],
})
export class PrescriptionPage implements OnInit {

  currentUser: User;
  modalControllers: ModalControllers;
  prescriptions: Prescription[] = [];
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
    this.modalControllers.addPrescription(this.currentUser,[]);
  }

  openEditPrescription(selectedPrescription: Prescription){
    this.modalControllers.callEditPrescription(this.currentUser, selectedPrescription);
  }





  buildPrescription(){
    this.realtimedatabase.getData().
    subscribe((data: any) => {
      const prescriptions = [];
      console.log("data");
      if (data.length === 0 ){
        this.interactionService.createToast('No data found', 'primary', 'bottom');
      }
      else {
        data.map(post => {
          post.map(presc => {
            prescriptions.push(presc);
          });
        });
        this.prescriptions = prescriptions.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
      }
    });
  }

  checkUserExistInComment(prescription: Prescription){
    const presc = prescription.comments.filter(comment => this.currentUser._id === comment.user_id)[0];
    if (presc && presc != null){
      return true;
    }
    else {
      return false;
    }
  }

}
