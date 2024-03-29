import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AuthService } from '../../services/auth.service';
import { ModalControllers } from '../../classes/modalController';
import { IonSlides, ModalController } from '@ionic/angular';
import { Prescription } from 'src/app/interfaces/prescription';
import { InteractionService } from '../../services/interaction.service';
import { map } from 'rxjs/operators';
import { Comment } from '../../interfaces/comment';
import { Offer } from 'src/app/interfaces/offer';
import { PrescriptionService } from 'src/app/services/prescription.service';
import { TranslateMedsurgService } from 'src/app/services/translate.service';
@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.page.html',
  styleUrls: ['./prescription.page.scss'],
})
export class PrescriptionPage implements OnInit {

  currentUser: User;
  modalControllers: ModalControllers;
  prescriptions: Prescription[] = [];
  currentSegmentType: string = 'prescriptions';
  offers: Offer[] | any;
  @ViewChild('slides') slides: IonSlides;

  currentSlide = 0;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    onlyExternal: false
  };
  constructor(private authService: AuthService,
              private modalController: ModalController,
              private interactionService: InteractionService,
              private prescriptionService: PrescriptionService,
              public translateService: TranslateMedsurgService) {
                this.modalControllers = new ModalControllers(modalController);
              }

  ngOnInit() {
    
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

  getCurrentUser() {
    this.currentUser = this.authService.user;
    this.buildPrescription();
    this.getOffers();

  }

  openAddPrescription() {
    this.modalControllers.addPrescription(this.currentUser,[]);
  }

  openEditPrescription(selectedPrescription: Prescription){
    this.modalControllers.callEditPrescription(this.currentUser, selectedPrescription);
  }

  buildPrescription(){
    this.interactionService.createLoading("LOADING_PRESCRIPTIONS")
      .then(() => {
        this.prescriptionService.getAllPrescriptions().
        then(async (data: any) => {
          this.interactionService.hide();
          console.log(data);
          if (data.length === 0 ){
            this.interactionService.createToast('TOAST_PRESCRIPTION_NOTFOUND', 'primary', 'bottom');
          }
          else {
            this.prescriptions = data.sort((a, b) => {
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
            await this.sortComments();
            this.interactionService.hide();
          }
        })
        .catch(err => {
          this.interactionService.hide();
          this.interactionService.createToast('TOAST_ERROR', 'danger', 'bottom');
        });
      })
  }


  getOffers(){
  }

  segmentChanged(event){
    this.currentSegmentType = event.detail.value;
  }


  calculateCommentPrice(comment: Comment){
    let commentPrice = 0;
    comment.products.map(product => {
      commentPrice += product.product.price * product.quantity;
    })
    return commentPrice;
  }

  async sortComments(){
    await this.prescriptions.map(async (prescription) => {
      await prescription.comments.sort((a,b) => {
        return this.calculateCommentPrice(a) - this.calculateCommentPrice(b);
      })
    })
  }

  ionViewDidEnter(){
    this.getCurrentUser();
  }
  

}
