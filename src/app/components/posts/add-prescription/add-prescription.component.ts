import { Component, OnInit, ViewChild } from '@angular/core';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { IonSlides, ModalController, NavController, NavParams } from '@ionic/angular';
import { Prescription } from 'src/app/interfaces/prescription';
import { User } from 'src/app/interfaces/user';
import { PhotoLibraryService } from 'src/app/services/plugins/photo-library.service';
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
              private modalCntrl: ModalController,
              private photoLibraryService: PhotoLibraryService,
              private photoLibrary: PhotoLibrary) { }

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

  



  addImageHolderPrescription(){
    if (this.images && this.images.length < 7){
      this.images.push({url:null});
    }
  }

  addPresciption(){
    if (this.images[0].url == null){
      this.interactionService.alertWithHandler('ALERTHANDLER_PICKIMAGE_MSG', 'ALERTHANDLER_REMOVEMEDECIN_ALERT' , 'ALERTHANDLER_PICKIMAGE_CANCEL' , 'ALERTHANDLER_PICKIMAGE_SUCCESS')
        .then((result) => {
          console.log(result);
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
    this.interactionService.createLoading('LOADING_UPLOADING_IMAGE')
    .then(() => {
      const formData = new FormData();
      this.files.map(file => {
        formData.append('file',file,"new");
      })
      this.prescriptionService.postImage(formData)
      .then((result: any) => {
        if (result){
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


  postPrescription(){
    console.log("here");
    this.interactionService.createLoading('LOADING_CREATE_PRESCRIPTION')
    .then(() => {
    this.prescriptionService.createPrescription(this.prescription)
    .then(response => {
      this.interactionService.hide();
      if (response && response !== false){
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

  preview(files,index:number) {
    if (files.length === 0){
        return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.interactionService.createToast('TOAST_IMAGE_ERROR', 'danger', 'bottom');
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

  getPhotos(){
    this.photoLibrary.requestAuthorization().then(() => {
      this.photoLibrary.getLibrary().subscribe({
        next: (library:any) => {
          console.log(library.library.length)
          library.library.forEach(function(libraryItem) {
            console.log(libraryItem.id);          // ID of the photo
            console.log(libraryItem.photoURL);    // Cross-platform access to photo
            console.log(libraryItem.thumbnailURL);// Cross-platform access to thumbnail
            console.log(libraryItem.fileName);
            console.log(libraryItem.width);
            console.log(libraryItem.height);
            console.log(libraryItem.creationDate);
            console.log(libraryItem.latitude);
            console.log(libraryItem.longitude);
            console.log(libraryItem.albumIds);    // array of ids of appropriate AlbumItem, only of includeAlbumsData was used
          });
        },
        error: err => { console.log('could not get photos'); },
        complete: () => { console.log('done getting photos'); }
      });
    })
    .catch(err => console.log('permissions weren\'t granted'))
  }
  
}
