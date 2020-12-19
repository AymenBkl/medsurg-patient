import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReferalpagePageRoutingModule } from './referalpage-routing.module';

import { ReferalpagePage } from './referalpage.page';
import { ShareModule } from 'src/app/components/share/share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReferalpagePageRoutingModule,
    ShareModule
  ],
  declarations: [ReferalpagePage]
})
export class ReferalpagePageModule {}
