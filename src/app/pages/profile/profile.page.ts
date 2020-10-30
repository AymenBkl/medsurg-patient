import { Component, OnInit } from '@angular/core';
import { InteractionService } from '../../services/interaction.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { onValueChanged } from '../register/valueChanges';
import { UserService } from '../../services/user/user.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  currentUser: User;
  toggle = false;
  profileForm: FormGroup;
  formErrors: any;
  submitted = false;
  constructor(private authService: AuthService,
              private interactionService: InteractionService,
              private formBuilder: FormBuilder,
              private userService: UserService) {
  }

  ngOnInit() {
    this.getCurrentUser();
  }


  getCurrentUser() {
    this.authService.getCurrentUser()
      .subscribe(user => {
        this.currentUser = user;
        this.buildReactiveForm();
      });
  }

  buildReactiveForm() {
    this.profileForm = this.formBuilder.group({
      firstname : [this.currentUser.firstname, [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      lastname : [this.currentUser.lastname, [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    });

    this.profileForm.valueChanges
      .subscribe(user => {
        this.formErrors = onValueChanged(user, this.profileForm);
        console.log(this.formErrors);
      });
  }

  update() {
    this.submitted = true;
    this.interactionService.createLoading('Updating your information')
      .then(() => {
        this.userService.updateUser(this.profileForm.value)
          .then((result: any) => {
            this.interactionService.hide();
            this.submitted = false;
            if (result && result !== false){
              this.currentUser = result;
              this.interactionService.createToast('Your Information Has Been Updated', 'success', 'bottom');
            }
            else {
              this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
            }
          })
          .catch(err => {
            this.submitted = false;
            this.interactionService.hide();
            this.interactionService.createToast('Something Went Wrong !', 'danger', 'bottom');
          });
      });
  }

}
