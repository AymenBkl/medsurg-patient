import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides, ModalController } from '@ionic/angular';
import { Referal } from 'src/app/interfaces/referal';
import { User } from 'src/app/interfaces/user';
import { ReferalService } from 'src/app/services/crm/referal.service';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-add-referal',
  templateUrl: './add-referal.component.html',
  styleUrls: ['./add-referal.component.scss'],
})
export class AddReferalComponent implements OnInit {

  @ViewChild('slides') slides: IonSlides;
  @Input('user') user:User;
  currentSlide = 0;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    onlyExternal: false
  };
  referal: Referal;
  submitted = false;
  constructor(private referalService: ReferalService,
              private interactionService: InteractionService,
              private  router: Router) { }

  ngOnInit() {
    this.initReferal();
    console.log("here");
  }

  start() {
    this.slides.getActiveIndex()
      .then(index => {
        this.currentSlide = index + 1;
        this.slides.slideNext();
        });
  }

  initReferal() {
    this.referal = {
      code:'',
      owner:this.user,
      commision:0,
      orders: null};
  }


  addReferel(){
    this.submitted = true;
    this.interactionService.createLoading("Adding your referal please wait !!!")
      .then(() => {
        this.referalService.createReferl(this.referal.code)
          .then((result: any) => {
            this.submitted = false;
            this.interactionService.hide();
              if (result && result != false){
                this.interactionService.createToast('Your Message Posted seccusefully', 'success', 'bottom');
                setTimeout(() => {
                  this.router.navigate(['/referal']);
                },1000)
              }
              else {
                this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
              }
        }   );
        }).catch(err => {
          this.submitted = true;
          this.interactionService.hide();
          this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
        });
  }

}



