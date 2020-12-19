import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { SearchProduct } from 'src/app/interfaces/searchproduct';

@Component({
  selector: 'app-searsh-medecin-detail',
  templateUrl: './searsh-medecin-detail.component.html',
  styleUrls: ['./searsh-medecin-detail.component.scss'],
})
export class SearshMedecinDetailComponent implements OnInit {

  searchProduct: SearchProduct;
  constructor(private navParams: NavParams) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.searchProduct = this.navParams.get('product');
    console.log(this.searchProduct);
  }

}
