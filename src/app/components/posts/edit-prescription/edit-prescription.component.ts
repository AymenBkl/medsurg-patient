import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, IonSlides, ModalController, NavController, NavParams } from '@ionic/angular';
import { ModalControllers } from 'src/app/classes/modalController';
import { ModalControllerSearch } from 'src/app/classes/modalController.searsh';
import { Comment } from 'src/app/interfaces/comment';
import { Prescription } from 'src/app/interfaces/prescription';
import { SearchProduct } from 'src/app/interfaces/searchproduct';
import { User } from 'src/app/interfaces/user';
import { CameraUploadService } from 'src/app/services/plugin/camera-upload.service';
import { PrescriptionService } from 'src/app/services/prescription.service';
import { TranslateMedsurgService } from 'src/app/services/translate.service';
import { InteractionService } from '../../../services/interaction.service';

@Component({
  selector: 'app-edit-prescription',
  templateUrl: './edit-prescription.component.html',
  styleUrls: ['./edit-prescription.component.scss'],
})
export class EditPrescriptionComponent implements OnInit {

  currentUser: User;
  prescription: Prescription;
  images: {url: any}[] = [];
  files: {file:Blob,index:string}[] = [];
  commentSelected: number;
  modalControllers: ModalControllerSearch;
  @ViewChild('slides') slides: IonSlides;

  currentSlide = 0;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    onlyExternal: false
  };

  constructor(private navParam: NavParams,
              private interactionService: InteractionService,
              private modalCntrl: ModalController,
              private prescriptionService: PrescriptionService,
              public translateService: TranslateMedsurgService,
              private cameraService: CameraUploadService,
              private actionSheetController: ActionSheetController) { 
                this.modalControllers = new ModalControllerSearch(modalCntrl);
              }

  ngOnInit() {
    this.getData();
    this.initImages();
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

  getData(){
    this.currentUser = this.navParam.get('user');
    this.prescription = this.navParam.get('prescriptions');
  }

  

  editPresciption(){
    if (this.files.length == 0){
          this.editPrescription();
    }
    else {
      this.postImage();
    }
  }

  initImages(){
    this.prescription.imageUrl.map((imageURL,i) => {
      this.images.push({url:imageURL});
      this.files.push({file:new Blob(),index:imageURL})
    })
    this.addImageHolderPrescription();
  }

  addImageHolderPrescription(){
    if (this.images && this.images.length < 7){
      this.images.push({url:null});
    }
  }

  postImage(){
    this.interactionService.createLoading('LOADING_UPLOADING_IMAGE')
    .then(() => {
      const formData = new FormData();
      this.files.map(file => {
        if (file.file != null){
          console.log("wow");
          formData.append('file',file.file,file.index);
          console.log(formData);
        }
      })
      this.prescriptionService.postImage(formData)
      .then((result: any) => {
        this.interactionService.hide();
        if (result){
          this.interactionService.createToast('TOAST_IMAGE_UPLOAD', 'success', 'bottom');
          this.prescription.imageUrl = result.prescription;
          this.editPrescription();
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

  editPrescription(){
    this.interactionService.createLoading('LOADING_UPDATE_PRESCRIPTION')
    this.prescriptionService.updatePrescription(this.prescription)
      .then(result => {
        this.interactionService.hide();
        if (result && result != false){
          this.interactionService.createToast('TOAST_PRESCRIPTION_UPDATED', 'success', 'bottom');
          this.modalCntrl.dismiss();
        }
        else {
          this.interactionService.createToast('TOAST_ERROR', 'danger', 'bottom');
        }
      })
      .catch((err)=> {
        this.interactionService.hide();
        this.interactionService.createToast('TOAST_ERROR', 'danger', 'bottom');
      })
  }

 

  selectedComment(index: number){
    if (this.prescription.status != 'accepted'){
      this.commentSelected = index;
    }
  }

  addOrder() {
    let selectedComment: any = this.prescription.comments[this.commentSelected];
    selectedComment.pharmacy.products = selectedComment.products;
    let selectedPharmacy : SearchProduct = {
      pharmacy_id: selectedComment.pharmacy._id,
      pharmacy : selectedComment.pharmacy,
      totalPrice: this.calculateCommentPrice(selectedComment)
    }
    this.modalControllers.callSearchDetail(selectedPharmacy,this.currentUser,{prescription:this.prescription._id,comment:selectedComment._id,type:'prescription'});
    this.modalCntrl.dismiss();
  }

  calculateCommentPrice(comment: Comment){
    let commentPrice = 0;
    comment.products.map(product => {
      commentPrice += product.product.price * product.quantity;
    })
    return commentPrice;
  }

  async sortComments(){
      await this.prescription.comments.sort((a,b) => {
        return this.calculateCommentPrice(a) - this.calculateCommentPrice(b);
      })
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


}
