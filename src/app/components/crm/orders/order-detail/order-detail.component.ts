import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Order } from 'src/app/interfaces/order';
import { User } from 'src/app/interfaces/user';
import { OrderService } from 'src/app/services/crm/order.service';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnInit {

  order: Order;
  currentUser: User;
  constructor(private navParams: NavParams,
              private modalCntrl: ModalController,
              private orderService: OrderService,
              private interactionService: InteractionService) {
              }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.order = this.navParams.get('order');
    this.currentUser = this.navParams.get('user');
    console.log(this.order);
  }

  goAddPrescription() {
  }

  getProductNames() {
    var productNames : string[] = [];
    this.order.products.map(product => {
      productNames.push(product.product.mainProduct.name + '\n');
    })
    return productNames;
  }



  updateOrder(status: string){
    this.interactionService.createLoading('Updating your order status ! Please Wait')
      .then(() => {
        this.orderService.editOrder(this.order._id,status)
          .then((result: any) => {
            this.interactionService.hide();
            if (result && result != false){
              this.interactionService.createToast('Your Order Has been Updated !', 'success', 'bottom');
              setTimeout(() => {
                this.modalCntrl.dismiss(null);
              },1500);
            }
            else {
              this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
            }
          })
          .catch(err => {
            this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
          })
      })
  }

  checkStatus(){
    if (this.order.status == 'created'){
      this.updateOrder('canceled');
    }
    else {

    }
  }

  ionViewDidEnter(){
    console.log("entered")
    this.getData();
  }



  

}



