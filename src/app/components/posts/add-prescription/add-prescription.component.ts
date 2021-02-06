import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController, NavController, NavParams } from '@ionic/angular';
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
  images: {url: any}[] = [];
  files: any[] = [];
  @ViewChild('slides') slides: IonSlides;

  currentSlide = 0;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    onlyExternal: false
  };
  constructor(private navParam: NavParams,
              private interactionService: InteractionService,
              private prescriptionService: PrescriptionService,
              private modalCntrl: ModalController) { }

  ngOnInit() {
    this.getData();
    this.addImageHolderPrescription();
  }

  getData(){
    this.currentUser = this.navParam.get('user');
    this.prescription = {
      patient : this.currentUser,
      description:this.navParam.get('productsNames'),
      imageUrl : null,
      createdAt : new Date().toISOString(),
      _id : null,
      comments : [],
      status:'created'
    };
    delete this.prescription._id;
  }

  selectedImage(event,index: number) {
    console.log(index);
    this.preview(event.target.files,index);
  }

  ngAfterViewInit() {
    setTimeout(
      () => {
        if (this.slides) {
          this.slides.update();
        }
      }, 300
    );
  }



  addImageHolderPrescription(){
    if (this.images.length < 7){
      this.images.push({url:null});
    }
  }

  addPresciption(){
    if (this.images[0].url == null){
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
      this.files.map(file => {
        formData.append('file',file,"new");
      })
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

  preview(files,index:number) {
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
      if (this.images[index].url == null){
        this.addImageHolderPrescription();
      }
      this.images[index] = {url: reader.result}
      this.files[index] = files[0];
      
      
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
