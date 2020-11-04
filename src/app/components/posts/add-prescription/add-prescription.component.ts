import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { Prescription } from 'src/app/interfaces/prescription';
import { User } from 'src/app/interfaces/user';
import { RealtimedatabaseService } from '../../../services/firebase/realtimedatabase.service';
import { InteractionService } from '../../../services/interaction.service';
@Component({
  selector: 'app-add-prescription',
  templateUrl: './add-prescription.component.html',
  styleUrls: ['./add-prescription.component.scss'],
})
export class AddPrescriptionComponent implements OnInit {

  currentUser: User;
  prescription: Prescription;
  image: any;
  constructor(private navParam: NavParams,
              private realTimeDatabase: RealtimedatabaseService,
              private interactionService: InteractionService) { }

  ngOnInit() {
    this.getData();
  }

  getData(){
    this.currentUser = this.navParam.get('user');
    this.prescription = {
      userFullName : this.currentUser.firstname + ' ' + this.currentUser.lastname,
      description : '',
      userImage : this.currentUser.imageUrl,
      user_id : this.currentUser._id,
      imageUrl : '',
      date : new Date().toISOString()
    };
  }

  selectedImage(event) {
    this.image = event.target.files[0];
  }

  addPresciption(){
    if (this.image == null){
      this.interactionService.alertWithHandler('You didnt pick any image', 'Alert' , 'Pick' , 'Post')
        .then((result) => {
          if (result && result === true){
            this.postPrescription();
          }
        });
    }
    else {
      this.postImage();
    }
  }

  postImage(){
    this.interactionService.createLoading('Creating your prescription please wait')
    .then(() => {
      this.realTimeDatabase.uploadFile(this.image)
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
    this.realTimeDatabase.addPost(this.prescription)
    .then(response => {
      this.interactionService.hide();
      if (response && response !== false){
        this.interactionService.createToast('Your prescreption is created succesfully', 'success', 'bottom');
      }
      else {
        this.interactionService.createToast('Something went wrong try Again !', 'danger', 'bottom');
      }
    }).catch(err => {
      this.interactionService.createToast('Something went wrong try Again !', 'danger', 'bottom');
    });
  }
}
