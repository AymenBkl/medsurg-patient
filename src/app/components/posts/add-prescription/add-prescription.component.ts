import { Component, OnInit, ViewChild } from '@angular/core';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { IonSlides, ModalController, NavController, NavParams } from '@ionic/angular';
import { Prescription } from 'src/app/interfaces/prescription';
import { User } from 'src/app/interfaces/user';
import { CameraUploadService } from 'src/app/services/plugin/camera-upload.service';
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
  images: { url: any }[] = [];
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
    private modalCntrl: ModalController,
    private cameraService: CameraUploadService) { }

  ngOnInit() {
    this.getData();
    this.addImageHolderPrescription();
  }

  getData() {
    this.currentUser = this.navParam.get('user');
    this.prescription = {
      patient: this.currentUser,
      description: this.navParam.get('productsNames'),
      imageUrl: null,
      createdAt: new Date().toISOString(),
      _id: null,
      comments: [],
      status: 'created'
    };
    delete this.prescription._id;
  }

  





  addImageHolderPrescription() {
    if (this.images && this.images.length < 7) {
      this.images.push({ url: null });
    }
  }

  addPresciption() {
    if (this.images[0].url == null) {
      this.interactionService.alertWithHandler('ALERTHANDLER_PICKIMAGE_MSG', 'ALERTHANDLER_REMOVEMEDECIN_ALERT', 'ALERTHANDLER_PICKIMAGE_CANCEL', 'ALERTHANDLER_PICKIMAGE_SUCCESS')
        .then((result) => {
          console.log(result);
          if (result && result === true) {
            this.postPrescription();
          }
        });
    }
    else {
      this.postImage();
    }
  }

  postImage() {
    this.interactionService.createLoading('LOADING_UPLOADING_IMAGE')
      .then(() => {
        const formData = new FormData();
        this.files.map(file => {
          formData.append('file', file, "new");
        })
        this.prescriptionService.postImage(formData)
          .then((result: any) => {
            if (result) {
              this.interactionService.createToast('TOAST_IMAGE_UPLOAD', 'success', 'bottom');
              this.interactionService.hide();
              this.prescription.imageUrl = result.prescription;
              this.postPrescription();
            }
            else {
              this.interactionService.createToast('TOAST_ERROR', 'danger', 'bottom');
            }
          }).catch(err => {
            this.interactionService.hide();
            this.interactionService.createToast('TOAST_ERROR', 'danger', 'bottom');
          });
      });
  }


  postPrescription() {
    console.log("here");
    this.interactionService.createLoading('LOADING_CREATE_PRESCRIPTION')
      .then(() => {
        this.prescriptionService.createPrescription(this.prescription)
          .then(response => {
            this.interactionService.hide();
            if (response && response !== false) {
              this.modalCntrl.dismiss();
              this.interactionService.createToast('TOAST_PRESCRIPTION_CREATED', 'success', 'bottom');
            }
            else {
              this.interactionService.createToast('TOAST_ERROR', 'danger', 'bottom');
            }
          }).catch(err => {
            this.interactionService.hide();
            this.interactionService.createToast('TOAST_ERROR', 'danger', 'bottom');
          });
      });
  }

  getPhoto(index){
    this.cameraService.openGallery(index)
      .then((result:any) => {
        console.log(JSON.stringify(result.url));
        console.log("file",result.file);
        if (result && result != null){
          console.log("check",result.url != '' && result.file != '');
          if (result === 'not image'){
            this.interactionService.createToast('TOAST_IMAGE_ERROR', 'danger', 'bottom');
          }
          else if (result.url != '' && result.file != '') {
            if (this.images[index].url == null) {
              this.addImageHolderPrescription();
            }
            this.images[index].url = result.url;
            this.files[index] = result.file;
          }
        }
      });
  }

  checkProductNames() {
    let productNames = this.navParam.get('productsNames');
    if (productNames.length != 0) {
      return productNames.join('')
    }
    else {
      return ''
    }
  }

  

}
