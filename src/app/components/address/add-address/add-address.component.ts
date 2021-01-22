import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InteractionService } from 'src/app/services/interaction.service';
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
  @Output() addressAdded: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private interactionService:InteractionService) { }

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
    this.submitted = true;
    this.userService.addAddress(this.addressForm.value)
      .then((result: any) => {
        this.submitted = false;
        if (result && result != false){
          this.interactionService.createToast("Address Has Been Added Succesfully", 'success', "bottom");
          this.back();
        }
        else {
          this.interactionService.createToast("Something Went Wrong !", 'danger', "bottom");
        }
      })
      .catch(err => {
        this.interactionService.createToast("Something Went Wrong !", 'danger', "bottom");
      })
  }

  back(){
    this.addressAdded.emit(false);
  }

}
