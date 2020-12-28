import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides, ModalController, NavParams } from '@ionic/angular';
import { Prescription } from 'src/app/interfaces/prescription';
import { Offer } from 'src/app/interfaces/offer';
import { Comment } from 'src/app/interfaces/comment';
import { User } from 'src/app/interfaces/user';
import { InteractionService } from 'src/app/services/interaction.service';
import { RealtimedatabaseService } from 'src/app/services/firebase/realtimedatabase.service';

@Component({
  selector: 'app-add-offer',
  templateUrl: './add-offer.component.html',
  styleUrls: ['./add-offer.component.scss'],
})
export class AddOfferComponent implements OnInit {

  currentUser: User;
  prescription: Prescription;
  offer: Offer;
  selectedComment: Comment;
  @ViewChild('slides') slides: IonSlides;

  currentSlide = 0;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    onlyExternal: false
  };
  submitted = false;
  selectedMethod:string;
  referalCode:string;
  constructor(private navParams: NavParams,
              private interactionService: InteractionService,
              private realTimeDatabase: RealtimedatabaseService,
              private router: Router,
              private modalCntrl: ModalController) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.selectedMethod = 'cod';
    this.referalCode = '';
    this.currentSlide = 0;
    this.prescription = this.navParams.get('prescription');
    this.currentUser = this.navParams.get('user');
    this.selectedComment = this.navParams.get('comment');
    this.offer = {
      prescriptionId: this.prescription.key,
      patient_id: this.currentUser._id,
      pharmacyId: this.selectedComment.user_id,
      date : new Date().toISOString(),
      key : '',
      commentId: this.selectedComment.commentId,
      offer: this.selectedComment.comment,
      method:'cod',
      status:'created',
    }
  }
  

  nextSlide() {
    this.slides.getActiveIndex()
      .then(index => {
        this.currentSlide = index + 1;
        console.log(index,this.currentSlide)
        this.slides.slideTo(this.currentSlide);
        });
  }


  selectMethod(type: string) {
    this.selectedMethod = type;
    this.offer.method = type;
    this.nextSlide();
  }

  createOffer(){
    if (this.currentSlide == 1){
      console.log(this.offer);
      this.interactionService.createLoading("Creating your Offer Please wait")
        .then(() => {
          this.realTimeDatabase.createOffer(this.offer,this.currentUser)
            .then((result) => {
              this.interactionService.hide();
              if (result && result != false){
                this.interactionService.createToast('Offer created Successfully ', 'success', 'bottom');
                setTimeout(() => {
                  this.router.navigate(['/tabs/tab4/prescription']);
                  this.modalCntrl.dismiss();
                },1000);
              }
              else {
                this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
              }
            })
            .catch(err => {
              this.interactionService.hide();
              this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
            })
        })
    }
  }


}
