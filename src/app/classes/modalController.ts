import { NavController, ModalController } from '@ionic/angular';
import { AddPrescriptionComponent } from '../components/posts/add-prescription/add-prescription.component';
import { EditPrescriptionComponent } from '../components/posts/edit-prescription/edit-prescription.component';
import { Product } from '../interfaces/product';
import { User } from '../interfaces/user';


export class ModalControllers {

    constructor(private modalController: ModalController){

    }

    public async addPrescription(currentUser: User){
        const modal = await this.modalController.create({
            component : AddPrescriptionComponent,
            componentProps : {
                user : currentUser
            }
        });
        modal.onDidDismiss()
            .then(data => {
                console.log(data);
            });
        return await modal.present();
    }

    public async callEditPrescription(currentUser: User, prescription){
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
}
