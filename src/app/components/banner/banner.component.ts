import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements OnInit {

  public slideOpts: { [k: string]: any } = {
    autoplay: {
      delay: 2500,
      // disableOnInteraction: false,
    }
  };
  objectTranslate: {prescription:string,order:string,referal:string,product:string,medecin:string} = {prescription:'',order:'',referal:'',product:'',medecin:''};
  constructor(private navCntrl: NavController,
              private _translate: TranslateService) { }

  ngOnInit() {
    this.getTranslate();
  }

  goTo(page){
    this.navCntrl.navigateForward(page);
  }


  getTranslate(){
    this._translate.setDefaultLang('en');
    this._translate.get('BANNER_PRESCRIPTION')
      .subscribe(res => {
        console.log(res);
        this.objectTranslate.prescription = res;
      })
  }
}
