import { Injectable, Injector } from '@angular/core';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { observable, Observable } from 'rxjs';
import { TranslateMedsurgService } from './translate.service';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {
  presentingLoadingController: HTMLIonLoadingElement;
  translateService: TranslateMedsurgService;
  constructor(private toastController: ToastController,
              private loadingController: LoadingController,
              private alertController: AlertController,
              private inj: Injector) { setTimeout(() => {
                this.translateService = this.inj.get(TranslateMedsurgService);
              },1000)}

  async createToast(msg, clr, pos){
    const toast = await this.toastController.create({
      message : this.translateService.translate(msg),
      color : clr,
      position : pos,
      duration : 1500,
      animated : true,
      cssClass : 'toast-customize',
    });
    return await toast.present();
  }

  async createLoading(msg?) {
    this.presentingLoadingController = await this.loadingController.create({
      message : msg,
      cssClass : 'loading-customize',
      duration : 100000,
      spinner : 'circles'
    });
    await this.presentingLoadingController.present();
  }

  async hide() {
    if (this.presentingLoadingController){
      this.presentingLoadingController.dismiss();
    }
    this.presentingLoadingController = null;
  }

   alertWithHandler(msg, hdr, cancelBtn, confirmBtn) {
    return new Promise((resolve, reject) => {
      this.alertController.create({
        header : hdr,
        message : msg,
        animated : true,
        buttons : [
          {
            text : cancelBtn,
            role : 'cancel',
            handler : () => {
              resolve(false);
            }
          },
          {
            text : confirmBtn,
            cssClass : 'danger',
            handler : () => {
              resolve(true);
            }
          }
        ]
      }).
        then((alert) => {
          alert.present();
      });
    });
  }
}
