import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { Prescription } from 'src/app/interfaces/prescription';
import { User } from 'src/app/interfaces/user';
import { RealtimedatabaseService } from '../../../services/firebase/realtimedatabase.service';

@Component({
  selector: 'app-add-prescription',
  templateUrl: './add-prescription.component.html',
  styleUrls: ['./add-prescription.component.scss'],
})
export class AddPrescriptionComponent implements OnInit {

  currentUser: User;
  prescription: Prescription;
  image: any;
  constructor(private navParam: NavParams,
              private realTimeDatabase: RealtimedatabaseService) { }

  ngOnInit() {
    this.getData();
  }

  getData(){
    this.currentUser = this.navParam.get('user');
    this.prescription = {
      userFullName : this.currentUser.firstname + ' ' + this.currentUser.lastname,
      description : '',
      userImage : this.currentUser.imageUrl,
      user_id : this.currentUser._id,
      imageUrl : '',
      date : new Date().toISOString()
    };
  }

  selectedImage(event) {
    this.image = event.target.files[0];
  }

  addPresciption(){
    this.realTimeDatabase.uploadFile(this.image)
      .then((result: any) => {
        if (result){
          this.prescription.imageUrl = result;
          console.log(this.prescription);
        }
      });
  }
}
