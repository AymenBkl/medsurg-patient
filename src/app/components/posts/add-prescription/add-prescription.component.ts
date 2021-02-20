import { Component, OnInit, ViewChild } from '@angular/core';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { ActionSheetController, IonSlides, ModalController, NavController, NavParams } from '@ionic/angular';
import { Prescription } from 'src/app/interfaces/prescription';
import { User } from 'src/app/interfaces/user';
import { CameraUploadService } from 'src/app/services/plugin/camera-upload.service';
import { PrescriptionService } from 'src/app/services/prescription.service';
import { TranslateMedsurgService } from 'src/app/services/translate.service';
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
    private actionSheetController: ActionSheetController,
    private cameraService: CameraUploadService,
    private translateService: TranslateMedsurgService) { }

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

  async presentActionSheet(index: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      cssClass: 'my-custom-class',
      buttons: [{

        text: this.translateService.translate('OPEN_CAMERA'),
        icon: 'camera-outline',
        handler: () => {
          this.getPhoto(index, 'camera')
        }
      },
      {

        text: this.translateService.translate('PICK_GALLERY'),
        icon: 'image-outline',
        handler: () => {
          this.getPhoto(index, 'gallery')
        }
      },
      {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  getPhoto(index, type: string) {
    this.cameraService.uploadPhotoGallery(type)
      .then((result: any) => {
        console.log(JSON.stringify(result.url));
        console.log("file", result.file);
        if (result && result != null) {
          console.log("check", result.url != '' && result.file != '');
          if (result === 'not image') {
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
      })
      .catch(err => {
        console.log(err);
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
