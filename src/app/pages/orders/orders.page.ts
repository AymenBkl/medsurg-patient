import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/interfaces/order';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/crm/order.service';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  currentUser: User;
  orders: Order[];
  constructor(private ordersService: OrderService,
              private authService: AuthService,
              private interactionService: InteractionService) { }

  ngOnInit() {
    this.currentUser = this.authService.user;
    this.subscribetoOrders();
    this.getAllOrders();
  }


  getAllOrders(){
    this.interactionService.createLoading("Loading Your Message !! ..")
      .then(() => {
        this.ordersService.getOrders()
          .then((result: any) => {
            this.interactionService.hide();
            if (result && result != false) {
              this.orders = result;
              console.log(this.orders);
              if (this.orders.length != 0) {
                this.interactionService.createToast('Your Orders has been loaded !', 'success', 'bottom');
              }
              else {
                this.interactionService.createToast('You dont have any orders !', 'warning', 'bottom');
              }
            }
            else {
              this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
            }
          })
          .catch(err => {
            this.interactionService.hide();
            if (err.status == 404) {
              this.interactionService.createToast('No Orders Found !', 'warrning', 'bottom');
            }
            else {
              this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
            }
          });
      })
  }

  subscribetoOrders() {
    this.ordersService.getOrderSubject()
      .subscribe(messages => {
        this.orders = messages;
      })
  }

  goToOrderDetail(order) {

  }


}
