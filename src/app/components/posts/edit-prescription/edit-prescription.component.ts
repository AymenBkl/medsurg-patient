import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { ModalControllers } from 'src/app/classes/modalController';
import { ModalControllerSearch } from 'src/app/classes/modalController.searsh';
import { Comment } from 'src/app/interfaces/comment';
import { Prescription } from 'src/app/interfaces/prescription';
import { SearchProduct } from 'src/app/interfaces/searchproduct';
import { User } from 'src/app/interfaces/user';
import { PrescriptionService } from 'src/app/services/prescription.service';
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
  modalControllers: ModalControllerSearch;


  constructor(private navParam: NavParams,
              private interactionService: InteractionService,
              private modalCntrl: ModalController,
              private prescriptionService: PrescriptionService) { 
                this.modalControllers = new ModalControllerSearch(modalCntrl);
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
            this.editPrescription();
    }
    else {
      this.postImage();
    }
  }

  postImage(){
    this.interactionService.createLoading('Uploading Image !! ')
    .then(() => {
      const formData = new FormData();
      formData.append('file', this.image.file);
      this.prescriptionService.postImage(formData)
      .then((result: any) => {
        this.interactionService.hide();
        if (result){
          this.interactionService.createToast('Image Uploaded !', 'success', 'bottom');
          this.prescription.imageUrl = result.prescription;
          this.editPrescription();
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

  editPrescription(){
    this.interactionService.createLoading('Updating Your prescription !!')
    this.prescriptionService.updatePrescription(this.prescription)
      .then(result => {
        this.interactionService.hide();
        if (result && result != false){
          this.interactionService.createToast('Prescription Updated!', 'success', 'bottom');
          this.modalCntrl.dismiss();
        }
        else {
          this.interactionService.createToast('Something went wrong try Again !', 'danger', 'bottom');
        }
      })
      .catch((err)=> {
        this.interactionService.hide();
        this.interactionService.createToast('Something went wrong try Again !', 'danger', 'bottom');
      })
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


}
