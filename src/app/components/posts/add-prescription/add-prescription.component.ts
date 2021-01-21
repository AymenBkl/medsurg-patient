import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { Prescription } from 'src/app/interfaces/prescription';
import { User } from 'src/app/interfaces/user';
import { PrescriptionService } from 'src/app/services/prescription.service';
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
              private interactionService: InteractionService,
              private prescriptionService: PrescriptionService,
              private modalCntrl: ModalController) { }

  ngOnInit() {
    this.getData();
  }

  getData(){
    this.currentUser = this.navParam.get('user');
    this.prescription = {
      patient : this.currentUser,
      description:this.navParam.get('productsNames'),
      imageUrl : '',
      createdAt : new Date().toISOString(),
      _id : null,
      comments : [],
      status:'created'
    };
    delete this.prescription._id;
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
    this.interactionService.createLoading('Uploading Image Please wait')
    .then(() => {
      const formData = new FormData();
      formData.append('file', this.image.file);
      this.prescriptionService.postImage(formData)
      .then((result: any) => {
        if (result){
          this.interactionService.createToast('Image Uploaded !', 'success', 'bottom');
          this.interactionService.hide();
          this.prescription.imageUrl = result.prescription;
          this.postPrescription();
        }
        else {
          this.interactionService.createToast('Something went wrong try Again !', 'danger', 'bottom');
        }
      }).catch(err => {
        this.interactionService.hide();
        this.interactionService.createToast('Something went wrong try Again !', 'danger', 'bottom');
      });
    });
  }

  postPrescription(){
    console.log("here");
    this.interactionService.createLoading('Uploading Image Please wait')
    .then(() => {
    this.prescriptionService.createPrescription(this.prescription)
    .then(response => {
      this.interactionService.hide();
      if (response && response !== false){
        this.modalCntrl.dismiss();
        this.interactionService.createToast('Your prescreption has been created succesfully', 'success', 'bottom');
      }
      else {
        this.interactionService.createToast('Something went wrong try Again !', 'danger', 'bottom');
      }
    }).catch(err => {
      this.interactionService.hide();
      this.interactionService.createToast('Something went wrong try Again !', 'danger', 'bottom');
    });
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
