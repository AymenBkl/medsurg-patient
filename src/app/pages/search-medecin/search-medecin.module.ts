import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchMedecinPageRoutingModule } from './search-medecin-routing.module';

import { SearchMedecinPage } from './search-medecin.page';

import { ShareModule } from '../../components/share/share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchMedecinPageRoutingModule,
    ShareModule
  ],
  declarations: [SearchMedecinPage]
})
export class SearchMedecinPageModule {}
