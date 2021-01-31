import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Order } from 'src/app/interfaces/order';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/crm/order.service';
import { InteractionService } from 'src/app/services/interaction.service';
import { ModalControllersOrders } from 'src/app/classes/modalController.orders';
import { config } from 'src/app/services/config';
import { CashfreeService } from 'src/app/services/cashfree.service';
import { PaymentStatus } from 'src/app/interfaces/paymentStatus';
import { Refund } from 'src/app/interfaces/refund';

@Component({
  selector: 'app-refund',
  templateUrl: './refund.page.html',
  styleUrls: ['./refund.page.scss'],
})
export class RefundPage implements OnInit {

  currentUser: User;
  refunds: Refund[];
  modalControllerOrder: ModalControllersOrders; 
  paymentStatus:{created:PaymentStatus[],accepted:PaymentStatus[],canceled:PaymentStatus[],rejected:PaymentStatus[],delivered:PaymentStatus[],all:PaymentStatus[]} = {created:[],accepted:[],canceled:[],rejected:[],delivered:[],all:[]};
  constructor(private ordersService: OrderService,
              private authService: AuthService,
              private interactionService: InteractionService,
              private modalCntrl: ModalController,
              private cashfree: CashfreeService) { 
                this.modalControllerOrder = new ModalControllersOrders(this.modalCntrl);
              }

  ngOnInit() {
    
  }

  ionViewDidEnter(){
    this.currentUser = this.authService.user;
    this.getAllRefunds();
  }



  getAllRefunds(){
    this.interactionService.createLoading("Loading Your Refunds !! ..")
      .then(() => {
        this.ordersService.getRefunds()
          .then((result: any) => {
            this.interactionService.hide();
            if (result && result != false) {
              this.refunds = result;
              if (result.length != 0) {
                this.interactionService.createToast('Your Refunds has been loaded !', 'success', 'bottom');
              }
              else {
                this.interactionService.createToast('You dont have any refunds !', 'warning', 'bottom');
              }
            }
            else {
              this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
            }
          })
          .catch(err => {
            this.interactionService.hide();
            if (err.status == 404) {
              this.interactionService.createToast('No Refunds Found !', 'warrning', 'bottom');
            }
            else {
              this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
            }
          });
      })
  }



  goToRefundDetail(refund: Refund) {
    this.modalControllerOrder.callRefundDetail(this.currentUser,refund.order)
  }




}
