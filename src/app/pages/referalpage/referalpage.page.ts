import { Component, OnInit } from '@angular/core';
import { Referal } from 'src/app/interfaces/referal';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { ReferalService } from 'src/app/services/crm/referal.service';

@Component({
  selector: 'app-referalpage',
  templateUrl: './referalpage.page.html',
  styleUrls: ['./referalpage.page.scss'],
})
export class ReferalpagePage implements OnInit {

  currentUser: User;
  referal: Referal;
  noRef: boolean;
  constructor(private referalService: ReferalService,
              private authService: AuthService) { }

  ngOnInit() {
    this.getUser();
  }

  getReferal(){
    this.referalService.getReferal()
      .then((result: any) => {
        console.log(result,this.noRef);
          if (result && result != false){
            this.noRef = false;
            this.referal = result;
          }
          else {
            this.noRef = true;
          }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  getUser() {
    this.currentUser = this.authService.user;
    this.getReferal();
  }



}
