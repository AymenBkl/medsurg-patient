import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BannerComponent } from '../banner/banner.component';

import { HeaderComponent } from '../header/header.component';
import { AddPrescriptionComponent } from '../posts/add-prescription/add-prescription.component';
import { EditPrescriptionComponent } from '../posts/edit-prescription/edit-prescription.component';

import { PrescriptionsComponent } from '../posts/prescriptions/prescriptions.component';

import { GetallmessagesComponent } from '../messages/getallmessages/getallmessages.component';
import { SendmessageComponent } from '../messages/sendmessage/sendmessage.component';

import { SearshMedecinDetailComponent } from '../searsh-medecin-detail/searsh-medecin-detail.component';

import { AddReferalComponent } from '../crm/referal/add-referal/add-referal.component';
@NgModule({
  declarations: [
    BannerComponent,
    HeaderComponent,
    AddPrescriptionComponent,
    EditPrescriptionComponent,
    PrescriptionsComponent,
    SendmessageComponent,
    GetallmessagesComponent,
    SearshMedecinDetailComponent,
    AddReferalComponent
  ],
  exports: [
    BannerComponent,
    HeaderComponent,
    AddPrescriptionComponent,
    EditPrescriptionComponent,
    PrescriptionsComponent,
    SendmessageComponent,
    GetallmessagesComponent,
    SearshMedecinDetailComponent,
    AddReferalComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class ShareModule { }
