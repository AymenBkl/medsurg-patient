import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { IonSlides, ModalController, NavParams } from '@ionic/angular';
import { Address } from 'src/app/interfaces/address';

import { Order } from 'src/app/interfaces/order';
import { Referal } from 'src/app/interfaces/referal';
import { SearchProduct } from 'src/app/interfaces/searchproduct';
import { User } from 'src/app/interfaces/user';
import { AddressesPage } from 'src/app/pages/addresses/addresses.page';
import { CashfreeService } from 'src/app/services/cashfree.service';
import { OrderService } from 'src/app/services/crm/order.service';
import { ReferalService } from 'src/app/services/crm/referal.service';
import { InteractionService } from 'src/app/services/interaction.service';
import { PrescriptionService } from 'src/app/services/prescription.service';
import * as mongoose from "mongoose";

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.scss'],
})
export class AddOrderComponent implements OnInit {

  currentUser: User;
  searchProduct: SearchProduct | any;
  order: Order;
  referalP: Referal;
  isPres: {prescription:string,comment:string,type:string} = null;
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
              private modalCntrl: ModalController,
              private prescriptionService: PrescriptionService,
              private cashfreeService: CashfreeService,
              private iab: InAppBrowser) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.selectedMethod = 'cod';
    this.referalCode = '';
    this.currentSlide = 0;
    this.searchProduct = this.navParams.get('searchProd');
    this.currentUser = this.navParams.get('user');
    this.isPres = this.navParams.get('isPres');
    console.log(this.isPres);
    this.order = {
      products : this.searchProduct.pharmacy.products,
      totalPrice: this.searchProduct.totalPrice,
      patient: this.currentUser,
      pharmacy: this.searchProduct.pharmacy,
      method: this.selectedMethod,
      status: "created",
      referal: this.referalP,
      address:null,
      _id :new mongoose.Types.ObjectId().toHexString(),
      createdAt : new Date().toISOString(),
    }
  }
  

  nextSlide() {
    console.log(this.order);
    this.slides.getActiveIndex()
      .then(index => {
        this.currentSlide = index + 1;
        console.log(index,this.currentSlide)
        this.slides.slideTo(this.currentSlide);
        });
  }


  async selectMethod(type: string) {
    this.selectedMethod = type;
    this.order.method = type;
    const modal = await this.modalCntrl.create({
      component : AddressesPage,
      backdropDismiss:true,
      componentProps:{
        order:true
      }
  });
  modal.onDidDismiss()
      .then((data) => {
        if (data && data.data){
          this.order.address = data.data;
          this.nextSlide();
        }
      });
  return await modal.present();
    
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
                this.modifyPres();
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

  modifyPres(){
    if (this.isPres){
      if (this.isPres.type == 'prescription' ){
        this.prescriptionService.updateApprovedPrescription(this.isPres.comment,this.isPres.prescription)
          .then((result) => {

          })
      }
    }
  }

  payByCard(){
    this.cashfreeService.createOrder(this.order)
      .then((orderCreated) => {
        if (orderCreated){
          this.cashfreeService.checkLink(this.order._id)
            .then((paymentLink: any) => {
              if (paymentLink && paymentLink.paymentLink)
              this.inAppBrowser(paymentLink.paymentLink);
            })
        }
      })
  }

  inAppBrowser(link) {
    const options: InAppBrowserOptions = {
      zoom: "no",
      fullscreen: "yes",
      hidenavigationbuttons: "no",
      toolbar: "no",
      hideurlbar: "yes",
    };
    const browser = this.iab.create(link, '_blank', {
      toolbar: "yes",
      hideurlbar: "yes",
      fullscreen: "yes",
      location: "yes",
      closebuttoncolor:'danger',
      closebuttoncaption:'Close',

      options,
    });
    
    browser.on('loadstop')
      .subscribe(event => {
        console.log(event)
          })
  }


}
