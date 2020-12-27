import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { ModalControllers } from 'src/app/classes/modalController';
import { ModalControllerSearch } from 'src/app/classes/modalController.searsh';
import { Prescription } from 'src/app/interfaces/prescription';
import { User } from 'src/app/interfaces/user';
import { RealtimedatabaseService } from '../../../services/firebase/realtimedatabase.service';
import { InteractionService } from '../../../services/interaction.service';

@Component({
  selector: 'app-edit-prescription',
  templateUrl: './edit-prescription.component.html',
  styleUrls: ['./edit-prescription.component.scss'],
})
export class EditPrescriptionComponent implements OnInit {

  currentUser: User;
  prescription: Prescription;
  image: {url: any, file: any};
  commentSelected: number;
  modalControllers: ModalControllers;


  constructor(private navParam: NavParams,
              private realTimeDatabase: RealtimedatabaseService,
              private interactionService: InteractionService,
              private modalCntrl: ModalController) { 
                this.modalControllers = new ModalControllers(modalCntrl);
              }

  ngOnInit() {
    this.getData();
  }

  getData(){
    this.currentUser = this.navParam.get('user');
    this.prescription = this.navParam.get('prescriptions');
  }

  selectedImage(event) {
    this.preview(event.target.files);
  }

  editPresciption(){
    if (this.image == null){
            this.postPrescription();
    }
    else {
      this.postImage();
    }
  }

  postImage(){
    this.interactionService.createLoading('Updating your prescription please wait')
    .then(() => {
      this.realTimeDatabase.uploadFile(this.image.file)
      .then((result: any) => {
        if (result){
          this.prescription.imageUrl = result;
          this.postPrescription();
        }
        else {
          this.interactionService.createToast('Something went wrong try Again !', 'danger', 'bottom');
        }
      }).catch(err => {
        this.interactionService.createToast('Something went wrong try Again !', 'danger', 'bottom');
      });
    });
  }

  postPrescription(){
    this.realTimeDatabase.updatePost(this.prescription)
    .then(response => {
      this.interactionService.hide();
      if (response && response !== false){
        this.interactionService.createToast('Your prescreption is updated succesfully', 'success', 'bottom');
      }
      else {
        this.interactionService.createToast('Something went wrong try Again !', 'danger', 'bottom');
      }
    }).catch(err => {
      this.interactionService.createToast('Something went wrong try Again !', 'danger', 'bottom');
    });
  }

  preview(files) {
    if (files.length === 0){
        return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.interactionService.createToast('Only images are supported.', 'danger', 'bottom');
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (event) => {
      this.image = {url: reader.result, file : files[0]};
    };
  }

  selectedComment(index: number){
    this.commentSelected = index;
  }

  addOrder() {
    this.modalControllers.callAddOrderPrescription(this.currentUser, this.prescription,this.prescription.comments[this.commentSelected]);
    this.modalCntrl.dismiss();
  }


}
