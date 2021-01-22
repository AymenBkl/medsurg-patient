import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { onValueChanged } from './valueChanges';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss'],
})
export class AddAddressComponent implements OnInit {

  addressForm: FormGroup;
  formErrors: any;
  submitted = false;
  constructor(private formBuilder: FormBuilder,
              private userService: UserService) { }

  ngOnInit() {
    this.buildReactiveForm();
  }


  buildReactiveForm() {
    this.addressForm = this.formBuilder.group({
      city : ['', [Validators.required, Validators.minLength(4)]],
      streetName : ['', [Validators.required, Validators.minLength(4)]],
      streetName1 : [''],
      postalCode : ['', [Validators.required, Validators.minLength(4), Validators.maxLength(6)]],
      buildingNumber : ['', [Validators.required]]
    });
    this.addressForm.valueChanges
      .subscribe(address => {
        this.formErrors = onValueChanged(address, this.addressForm);
        console.log(this.formErrors);
      });
  }


  addAddress() {
    this.userService.addAddress(this.addressForm.value)
      .then((result) => {
        console.log(result);
      })
  }

}
