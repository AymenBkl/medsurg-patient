import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslateMedsurgService {

  constructor(private translateService: TranslateService) {
    translateService.setDefaultLang('en');
    translateService.use('en');
   }


  translate(str:string) {
    const currentLang = 'en';
    const returnValue = this.translateService.translations[currentLang][str];
    if (returnValue === undefined) {
      return this.translateService.translations.en_merch[str];
    } else {
      return returnValue;
    }
  }
}


