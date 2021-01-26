import {  ModalController } from '@ionic/angular';
import { OrderDetailComponent } from '../components/crm/orders/order-detail/order-detail.component';
import { RefundComponent } from '../components/crm/orders/refund/refund.component';
import { Order } from '../interfaces/order';
import { User } from '../interfaces/user';

export class ModalControllersOrders {

    constructor(private modalController: ModalController){

    }

    public async callEditOrder(userr: User,ordeR: Order){
        const modal = await this.modalController.create({
            component : OrderDetailComponent,
            componentProps : {
                user: userr,
                order: ordeR
            }
            
        });
        modal.onDidDismiss()
            .then(data => {
            });
        return await modal.present();
    }

    public async callRefund(userr: User,ordeR: Order){
        const modal = await this.modalController.create({
            component : RefundComponent,
            componentProps : {
                user: userr,
                order: ordeR
            }
            
        });
        modal.onDidDismiss()
            .then(data => {
            });
        return await modal.present();
    }
}
