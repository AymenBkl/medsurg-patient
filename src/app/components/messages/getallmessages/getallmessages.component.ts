import { Message } from '../../../interfaces/message';
import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { InteractionService } from 'src/app/services/interaction.service';
import { MessageService } from 'src/app/services/messages/messages.service';
import { TranslateMedsurgService } from 'src/app/services/translate.service';

@Component({
  selector: 'app-getallmessages',
  templateUrl: './getallmessages.component.html',
  styleUrls: ['./getallmessages.component.scss'],
})
export class GetallmessagesComponent implements OnInit {


  @Input('user') currentUser: User;
  messages: Message[] = [];
  messagesTotalReceived: {sent: Message[],recieved: Message[]} = {sent: [],recieved: []};

  currentSegmentType:string = 'sent';

  constructor(private messageService: MessageService,
              private interactionService: InteractionService,
              public translateService: TranslateMedsurgService) { }

  ngOnInit() {
    
  }

  ionViewDidEnter(){
    this.subscribetoMessages();
    this.getAllMessages();
  }


  getAllMessages() {
    this.interactionService.createLoading("LOADING_MESSAGES")
      .then(() => {
        this.messageService.getMessages()
          .then((result: any) => {
            this.interactionService.hide();
            if (result && result != false) {
              this.messages = result;
              if (this.messages.length != 0) {3
                this.filterMessages(result);
                this.interactionService.createToast('TOAST_MESSAGES_ALL', 'success', 'bottom');
              }
              else {
                this.interactionService.createToast('TOAST_NO_MESSAGES', 'warning', 'bottom');
              }
            }
            else {
              this.interactionService.createToast('TOAST_ERROR', 'danger', 'bottom');
            }
          })
          .catch(err => {
            this.interactionService.hide();
            if (err.status == 404) {
              this.interactionService.createToast('TOAST_NOTFOUND_MESSAGES', 'warrning', 'bottom');
            }
            else {
              this.interactionService.createToast('TOAST_ERROR', 'danger', 'bottom');
            }
          });
      })
  }

  subscribetoMessages() {
    this.messageService.getMessagesSubject()
      .subscribe(messages => {
        this.messages = messages;
        this.filterMessages(messages);
      })
  }

  filterMessages(messages: Message[]) {
    this.messagesTotalReceived = {sent: [],recieved: []};

    messages.map(message => {
      if (message.from._id != this.currentUser._id){
        this.messagesTotalReceived.recieved.push(message);
      }
      else {
        this.messagesTotalReceived.sent.push(message);
      }
      
    });
    console.log(this.messagesTotalReceived);
  }

  segmentChanged(event){
    this.currentSegmentType = event.detail.value;
  }

}
