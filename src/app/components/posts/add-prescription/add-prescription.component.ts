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
  image: {url: any, file: any};
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
      description : this.checkProductNames(),
      userImage : this.currentUser.imageUrl,
      user_id : this.currentUser._id,
      imageUrl : '',
      date : new Date().toISOString(),
      key : '',
      comments : []
    };
  }

  selectedImage(event) {
    this.preview(event.target.files);
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

  checkProductNames() {
    let productNames = this.navParam.get('productsNames');
    if (productNames.length != 0){
      return productNames.join('')
    }
    else {
      return ''
    }
  }
}
