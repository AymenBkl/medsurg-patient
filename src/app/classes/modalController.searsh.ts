import {  ModalController } from '@ionic/angular';
import { SendmessageComponent } from '../components/messages/sendmessage/sendmessage.component';
import { User } from '../interfaces/user';
import { SearshMedecinDetailComponent } from '../components/searsh-medecin-detail/searsh-medecin-detail.component';
import { SearchProduct } from '../interfaces/searchproduct';

export class ModalControllerSearch {

    constructor(private modalController: ModalController){

    }

    public async callSearchDetail(searchProduct: SearchProduct,currentUser: User){
        const modal = await this.modalController.create({
            component : SearshMedecinDetailComponent,
            componentProps : {
                product: searchProduct,
                user: currentUser
            }
            
        });
        modal.onDidDismiss()
            .then(data => {
            });
        return await modal.present();
    }
}
