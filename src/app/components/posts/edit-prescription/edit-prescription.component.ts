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
            this.postPrescription();
    }
    else {
      this.postImage();
    }
  }

  postImage(){
    this.interactionService.createLoading('Creating your prescription please wait')
    .then(() => {
      const formData = new FormData();
      formData.append('file', this.image.file);
      this.prescriptionService.postImage(formData)
      .then((result: any) => {
        if (result){
          console.log("here");
          this.prescription.imageUrl = result.prescription;
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
    /**this.realTimeDatabase.updatePost(this.prescription)
    .then(response => {
      this.interactionService.hide();
      if (response && response !== false){
        this.interactionService.createToast('Your prescreption is updated succesfully', 'success', 'bottom');
      }
      else {
        this.interactionService.createToast('Something went wrong try Again !', 'danger', 'bottom');
      }
    }).catch(err => {
      this.interactionService.createToast('Something went wrong try Again !', 'danger', 'bottom');
    });**/
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
    console.log(selectedPharmacy)
    this.modalControllers.callSearchDetail(selectedPharmacy,this.currentUser);
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
