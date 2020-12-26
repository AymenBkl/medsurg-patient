import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides, ModalController, NavParams } from '@ionic/angular';
import { Order } from 'src/app/interfaces/order';
import { Referal } from 'src/app/interfaces/referal';
import { SearchProduct } from 'src/app/interfaces/searchproduct';
import { User } from 'src/app/interfaces/user';
import { OrderService } from 'src/app/services/crm/order.service';
import { ReferalService } from 'src/app/services/crm/referal.service';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.scss'],
})
export class AddOrderComponent implements OnInit {

  currentUser: User;
  searchProduct: SearchProduct | any;
  order: Order | any;
  referalP: Referal;
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
              private referalService: ReferalService,
              private interactionService: InteractionService,
              private orderService: OrderService,
              private router: Router,
              private modalCntrl: ModalController) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.selectedMethod = 'cod';
    this.referalCode = '';
    this.currentSlide = 0;
    this.searchProduct = this.navParams.get('searchProd');
    this.currentUser = this.navParams.get('user');
    
    this.order = {
      products : this.searchProduct.pharmacy.products,
      totalPrice: this.searchProduct.totalPrice,
      patient: this.currentUser,
      pharmacy: this.searchProduct.pharmacy,
      method: this.selectedMethod,
      status: "created",
      referal: this.referalP,
    }
    console.log(this.order);
    console.log(this.searchProduct.pharmacy.products)
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
    this.order.method = type;
    this.nextSlide();
  }

  checkReferal() {
    this.submitted = true;
    this.referalService.checkReferal(this.referalCode)
      .then((result: any) => {
        this.submitted = false;
        if (result && result != false){
          this.referalP = result;
          this.order.referal = result;
          if (this.referalP.owner._id != this.currentUser._id){
            this.interactionService.createToast('Referal Added', 'success', 'bottom');
            this.nextSlide();
          }
          else {
            this.interactionService.createToast('You cant apply your own referal', 'light', 'bottom');
            this.referalCode = '';
            this.referalP = null;
          }
        }
        else {
          this.referalP = null;
          this.interactionService.createToast('Referal not exist', 'danger', 'bottom');
          this.referalCode = '';
        }
      })
      .catch((err)=> {
        this.referalP = null;
        this.referalCode = '';
        this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
        this.submitted = false;
      })
  }

  createOrder(){
    if (this.currentSlide == 2){
      console.log(this.order);
      this.interactionService.createLoading("Creating your Order Please wait")
        .then(() => {
          this.orderService.createOrder(this.order)
            .then((result) => {
              this.interactionService.hide();
              if (result && result != false){
                this.interactionService.createToast('Order created Successfully ', 'success', 'bottom');
                setTimeout(() => {
                  this.router.navigate(['/orders']);
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

  ionViewDidEnter(){
    console.log('entered');
    this.getData();
  }


  ionModalWillDismiss(){
    console.log("dissmiss");
  }


}
