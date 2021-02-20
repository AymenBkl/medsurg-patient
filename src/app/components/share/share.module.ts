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

import { AddOfferComponent } from '../crm/offers/add-offer/add-offer.component';
import { CategoriesComponent } from '../crm/categories/categories.component';

import { AddAddressComponent } from '../address/add-address/add-address.component';
import { RefundComponent } from '../crm/orders/refund/refund.component';
import { RefundDetailComponent } from '../crm/refund-detail/refund-detail.component';
import { PaymentDetailComponent } from '../payment-detail/payment-detail.component';

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
    LsitComponent,
    AddOfferComponent,
    CategoriesComponent,
    AddAddressComponent,
    RefundComponent,
    RefundDetailComponent,
    PaymentDetailComponent,
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
    LsitComponent,
    AddOfferComponent,
    CategoriesComponent,
    AddAddressComponent,
    RefundComponent,
    RefundDetailComponent,
    PaymentDetailComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class ShareModule { }
