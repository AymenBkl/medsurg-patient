import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides, ModalController, NavParams } from '@ionic/angular';
import { Prescription } from 'src/app/interfaces/prescription';
import { Offer } from 'src/app/interfaces/offer';
import { Comment } from 'src/app/interfaces/comment';
import { User } from 'src/app/interfaces/user';
import { InteractionService } from 'src/app/services/interaction.service';

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
              private router: Router,
              private modalCntrl: ModalController) { }

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

 
  


}
