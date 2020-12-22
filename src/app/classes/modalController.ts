import { NavController, ModalController } from '@ionic/angular';
import { AddOrderComponent } from '../components/crm/orders/add-order/add-order.component';
import { AddPrescriptionComponent } from '../components/posts/add-prescription/add-prescription.component';
import { EditPrescriptionComponent } from '../components/posts/edit-prescription/edit-prescription.component';
import { Pharmacy } from '../interfaces/pharmacy';
import { Prescription } from '../interfaces/prescription';
import { Product } from '../interfaces/product';
import { SearchProduct } from '../interfaces/searchproduct';
import { User } from '../interfaces/user';


export class ModalControllers {

    constructor(private modalController: ModalController){

    }

    public async addPrescription(currentUser: User,productNames: string[]){
        const modal = await this.modalController.create({
            component : AddPrescriptionComponent,
            componentProps : {
                user : currentUser,
                productsNames: productNames
            }
        });
        modal.onDidDismiss()
            .then(data => {
                console.log(data);
            });
        return await modal.present();
    }

    public async callEditPrescription(currentUser: User, prescription: Prescription){
        const modal = await this.modalController.create({
            component : EditPrescriptionComponent,
            componentProps : {
                user : currentUser,
                prescriptions : prescription,
            }
        });
        modal.onDidDismiss()
            .then(data => {
                console.log(data);
            });
        return await modal.present();
    }

    public async callAddOrder(currentUser: User,searchProduct: SearchProduct){
        const modal = await this.modalController.create({
            component : AddOrderComponent,
            componentProps : {
                user : currentUser,
                searchProd: searchProduct
            }
        });
        modal.onDidDismiss()
            .then(data => {
                console.log(data);
            });
        return await modal.present();
    }

}
