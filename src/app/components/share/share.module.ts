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

import { AddOrderComponent } from '../crm/orders/add-order/add-order.component';

import {OrderDetailComponent} from '../crm/orders/order-detail/order-detail.component';

import { LsitComponent } from '../crm/cart/lsit/lsit.component';
import { CartComponent } from '../crm/cart/cart.component';
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
    AddReferalComponent,
    AddOrderComponent,
    OrderDetailComponent,
    CartComponent,
    LsitComponent
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
    AddReferalComponent,
    AddOrderComponent,
    OrderDetailComponent,
    CartComponent,
    LsitComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class ShareModule { }
