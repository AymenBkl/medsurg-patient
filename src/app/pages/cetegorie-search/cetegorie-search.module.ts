import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CetegorieSearchPageRoutingModule } from './cetegorie-search-routing.module';

import { CetegorieSearchPage } from './cetegorie-search.page';
import { ShareModule } from 'src/app/components/share/share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CetegorieSearchPageRoutingModule,
    ShareModule
  ],
  declarations: [CetegorieSearchPage]
})
export class CetegorieSearchPageModule {}
