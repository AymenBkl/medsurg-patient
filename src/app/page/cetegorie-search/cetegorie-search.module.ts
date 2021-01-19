import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CetegorieSearchPageRoutingModule } from './cetegorie-search-routing.module';

import { CetegorieSearchPage } from './cetegorie-search.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CetegorieSearchPageRoutingModule
  ],
  declarations: [CetegorieSearchPage]
})
export class CetegorieSearchPageModule {}
