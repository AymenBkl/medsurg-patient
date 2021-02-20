import { Component, OnInit, ViewChild } from '@angular/core';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { IonSlides, ModalController, NavController, NavParams } from '@ionic/angular';
import { Prescription } from 'src/app/interfaces/prescription';
import { User } from 'src/app/interfaces/user';
import { PrescriptionService } from 'src/app/services/prescription.service';
import { InteractionService } from '../../../services/interaction.service';
import { ImagePicker } from '@ionic-native/image-picker/ngx';

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
    private imagePicker: ImagePicker) { }

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

  selectedImage(base64Data: string, index: number) {
    console.log(index);
    this.preview(this.convertBase64ToBlob(base64Data), index);
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

  preview(file, index: number) {
    console.log(file)
    if (!file) {
      return;
    }
    const mimeType = file.type;
    if (mimeType.match(/image\/*/) == null) {
      this.interactionService.createToast('TOAST_IMAGE_ERROR', 'danger', 'bottom');
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      if (this.images[index].url == null) {
        this.addImageHolderPrescription();
      }
      this.images[index] = { url: reader.result }
      this.files[index] = file;


    };
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

  openGallery (index:number): void {
    let options = {
      maximumImagesCount: 1,
      width: 500,
      height: 500,
      quality: 100,
      outputType: 1
    }
  
    this.imagePicker.getPictures(options).then(
      file_uris => {
        console.log(file_uris);
        this.selectedImage('data:image/jpeg;base64,' + file_uris,index)
      },

      err => console.log('uh oh')
    );
  }

  private convertBase64ToBlob(base64Image: string) {
    console.log(base64Image);
    // Split into two parts
    const parts = base64Image.split(';base64,');
    console.log(parts[1])
    // Hold the content type
    const imageType = parts[0].split(':')[1];
    console.log(imageType)
    // Decode Base64 string 
    const decodedData = atob(parts[1]);
  
    // Create UNIT8ARRAY of size same as row data length
    const uInt8Array = new Uint8Array(decodedData.length);
  
    // Insert all character code into uInt8Array
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i);
    }
  
    // Return BLOB image after conversion
    return new Blob([uInt8Array], { type: imageType });
  }

}
