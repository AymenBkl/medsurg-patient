import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-add-prescription',
  templateUrl: './add-prescription.component.html',
  styleUrls: ['./add-prescription.component.scss'],
})
export class AddPrescriptionComponent implements OnInit {

  currentUser: User;
  constructor(private navParam: NavParams) { }

  ngOnInit() {
    this.getData();
  }

  getData(){
    this.currentUser = this.navParam.get('user');
  }
}
