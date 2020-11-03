import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchMedecinPageRoutingModule } from './search-medecin-routing.module';

import { SearchMedecinPage } from './search-medecin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchMedecinPageRoutingModule
  ],
  declarations: [SearchMedecinPage]
})
export class SearchMedecinPageModule {}
