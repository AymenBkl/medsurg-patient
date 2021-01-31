import { Component, OnInit } from '@angular/core';
import { NavController, NavParams,ModalController } from '@ionic/angular';
import { Message } from 'src/app/interfaces/message';
import { User } from 'src/app/interfaces/user';
import { MessageService } from 'src/app/services/messages/messages.service';
import { InteractionService } from '../../../services/interaction.service';

@Component({
  selector: 'app-sendmessage',
  templateUrl: './sendmessage.component.html',
  styleUrls: ['./sendmessage.component.scss'],
})
export class SendmessageComponent implements OnInit {

  currentUser: User;
  message: Message;
  constructor(private navParam: NavParams,
              private messageService: MessageService,
              private interactionService: InteractionService,
              private modalCntrl: ModalController) { }

  ngOnInit() {
    this.getData();
  }

  getData(){
    this.currentUser = this.navParam.get('user');
    this.message = {
      message: '',
      to : "60158b26bfcd9008c545da46",
      from : this.currentUser
    };
  }

  

  checkMessage(){
    if (this.message.message === ''){
      this.interactionService.createToast('Post a message', 'danger', 'bottom')
    }
    else {
      this.postMessage();
    }
  }

  postMessage(){
    this.interactionService.createLoading('Posting Your Message !!')
      .then(() => {
        this.messageService.postMessage(this.message)
          .then((result: any) => {
            this.interactionService.hide();
            if (result && result !== false){
              this.interactionService.createToast('Your Message Posted seccusefully', 'success', 'bottom');
              this.modalCntrl.dismiss();
            }
            else {
              this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
            }
      }   );
      }).catch(err => {
        this.interactionService.hide();
        this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
      });
  }

}







