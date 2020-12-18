import {  ModalController } from '@ionic/angular';
import { SendmessageComponent } from '../components/messages/sendmessage/sendmessage.component';
import { User } from '../interfaces/user';

export class ModalControllersMessages {

    constructor(private modalController: ModalController){

    }

    public async callAddMessage(userr: User){
        const modal = await this.modalController.create({
            component : SendmessageComponent,
            componentProps : {
                user: userr
            }
            
        });
        modal.onDidDismiss()
            .then(data => {
            });
        return await modal.present();
    }
}
