import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '../register/must-matchValdiator';
import { onValueChanged } from './valueChanges';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  resetPasswordForm: FormGroup;
  formErrors: any;
  submitted = false;
  validationErrors: {errmsg , errcode};
  constructor(private formBuilder: FormBuilder) {
      this.buildResetPasswordForm();
   }

  ngOnInit() {
  }

  buildResetPasswordForm() {
    this.resetPasswordForm = this.formBuilder.group({
      password : ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword : ['', [Validators.required, Validators.minLength(6)]],
    },
    {
      validators : MustMatch('password', 'confirmPassword')
    });
    this.resetPasswordForm.valueChanges
      .subscribe(resetPassword => {
        this.formErrors = onValueChanged(resetPassword, this.resetPasswordForm);
        console.log(resetPassword);
      });
  }

  resetPassword(){
    console.log(this.resetPasswordForm.value);
  }


}
