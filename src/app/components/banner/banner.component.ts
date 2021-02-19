import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranslateMedsurgService } from 'src/app/services/translate.service';

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
  constructor(private navCntrl: NavController,
              public translateService: TranslateMedsurgService) { }

  ngOnInit() {
  }

  goTo(page){
    this.navCntrl.navigateForward(page);
  }


}
