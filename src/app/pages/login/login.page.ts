import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { onValueChanged } from './valueChanges';
import { AuthService } from '../../services/auth.service';
import { InteractionService } from '../../services/interaction.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ResetPasswordPage } from '../reset-password/reset-password.page';
import { TranslateMedsurgService } from 'src/app/services/translate.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  formErrors: any;
  submitted = false;
  validationErrors: { errmsg, errcode };
  passwordHidden :boolean = true;
  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private interactionService: InteractionService,
    private router: Router,
    private modalController: ModalController,
    public translateService: TranslateMedsurgService) {
    this.buildLoginForm();
  }

  ngOnInit() {
  }

  buildLoginForm() {
    this.loginForm = this.formBuilder.group({
      phoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: false,
      passwordHidden:true
    });
    this.loginForm.valueChanges
      .subscribe(user => {
        this.formErrors = onValueChanged(user, this.loginForm);
        console.log(this.loginForm.value.passwordHidden)
      });
  }

  logIn() {
    this.submitted = true;
    console.log(this.loginForm.value);
    this.authService.logIn(this.loginForm.value)
      .then((result: any) => {
        console.log(result);
        if (result && result !== false) {
          this.interactionService.createToast('TOAST_WELCOM', 'success', 'bottom');
          if (result.role === 'patient') {
            if (result.emailVerified === false || result.emailVerified == null) {
              this.goToHome();
            }
            else {
              this.goToHome();
            }
          }
          else {
            this.toastAlert();
          }
        }
        else {
          this.interactionService.createToast('TOAST_ERROR1', 'danger', 'bottom');
          this.submitted = false;
        }
      })
      .catch(err => {
        console.log(err);
        this.submitted = false;
        this.validationErrors = err;
        this.interactionService.createToast(this.validationErrors.errmsg, 'danger', 'bottom')
          .then(() => {
          });
      });
  }


  callEmailVerification(user) {
    this.interactionService.alertWithHandler('Do you want to confirm your email', 'EMAIL CONFIRMATION', 'NO', 'CONFIRM')
      .then(action => {
        if (action && action === true) {
          // this.callVerificationPage(user);
        }
        else {
          this.goToHome();
        }
      });
  }


  goToHome() {
    this.interactionService.createLoading('LOADING');
    this.router.navigate(['/home']);
    setTimeout(() => {
      this.interactionService.hide();
    }, 500);
  }

  ionViewDidEnter() {
    this.submitted = false;
  }

  toastAlert() {
    this.submitted = false;
    this.interactionService.createToast('TOAST_NOT_ALLOWED', 'danger', 'bottom');
  }

  async resetPassword() {
    const modal = await this.modalController.create({
      component: ResetPasswordPage,
    });
    modal.onDidDismiss()
      .then(data => {
        console.log(data);
        if (data && data.data && data.data.success) {
          console.log("here");
          this.loginForm.patchValue({
            phoneNumber: data.data.phoneNumber,
            password: data.data.newPassword
          })
        }
      });
    return await modal.present();
  }

  numberOnlyValidation(event: any) {
    const pattern = /[0-9.,]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

}
