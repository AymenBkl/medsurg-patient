import { Message } from '../../../interfaces/message';
import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { InteractionService } from 'src/app/services/interaction.service';
import { MessageService } from 'src/app/services/messages/messages.service';

@Component({
  selector: 'app-getallmessages',
  templateUrl: './getallmessages.component.html',
  styleUrls: ['./getallmessages.component.scss'],
})
export class GetallmessagesComponent implements OnInit {


  @Input('user') currentUser: User;
  messages: Message[] = [];

  constructor(private messageService: MessageService,
              private interactionService: InteractionService) { }

  ngOnInit() {
    this.subscribetoMessages();
    this.getAllMessages();
  }


  getAllMessages() {
    this.interactionService.createLoading("Loading Your Message !! ..")
      .then(() => {
        this.messageService.getMessages()
          .then((result: any) => {
            this.interactionService.hide();
            if (result && result != false){
              this.messages = result;
              if (this.messages.length != 0){
                this.interactionService.createToast('Your Messages has been loaded !', 'success', 'bottom');
              }
              else {
                this.interactionService.createToast('You dont have any messages !' , 'warning', 'bottom');
              }
            }
            else {
              this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
            }
          })
          .catch(err => {
            this.interactionService.hide();
            if (err.status == 404) {
              this.interactionService.createToast('No meesages Found !', 'warrning', 'bottom');
            }
            else {
              this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
            }
          });
      })
  }

  subscribetoMessages() {
    this.messageService.getMessagesSubject()
      .subscribe(messages => {
        this.messages = messages;
      })
  }

}
