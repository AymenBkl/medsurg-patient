import { Component, OnInit } from '@angular/core';
import { InteractionService } from '../../services/interaction.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  currentUser: User;
  toggle = false;
  constructor(private authService: AuthService,
              private interactionService: InteractionService) { }

  ngOnInit() {
    this.getCurrentUser();
    setInterval(() => {
      console.log(this.toggle);
    },2000);
  }


  getCurrentUser() {
    this.authService.getCurrentUser()
      .subscribe(user => {
        this.currentUser = user;
      });
  }

}
