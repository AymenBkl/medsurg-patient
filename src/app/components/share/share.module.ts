import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BannerComponent } from '../banner/banner.component';

import { HeaderComponent } from '../header/header.component';
import { AddPrescriptionComponent } from '../posts/add-prescription/add-prescription.component';
import { EditPrescriptionComponent } from '../posts/edit-prescription/edit-prescription.component';



@NgModule({
  declarations: [
    BannerComponent,
    HeaderComponent,
    AddPrescriptionComponent,
    EditPrescriptionComponent
  ],
  exports: [
    BannerComponent,
    HeaderComponent,
    AddPrescriptionComponent,
    EditPrescriptionComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class ShareModule { }
