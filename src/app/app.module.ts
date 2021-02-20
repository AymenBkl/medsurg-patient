import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, NavParams } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import {HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

import { AuthGuardService } from './services/auth-guard.service';
import { InteractionService } from './services/interaction.service';
import { InterceptorService, UnauthorizedInterceptor } from './services/interceptor.service';
import { AuthService } from './services/auth.service';
import { StorageService } from './services/storage.service';
import { SearchMedecinService } from './services/search/search-medecin.service';
import { ProccessHttpErrosService } from './services/proccess-http-erros.service';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { File } from '@ionic-native/file/ngx';
import { config } from './services/config';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { MessageService } from './services/messages/messages.service';
import { ReferalService } from './services/crm/referal.service';
import { OrderService } from './services/crm/order.service';
import { CategoryService } from './services/crm/category.service';
import { PrescriptionService } from './services/prescription.service';
import { CashfreeService } from './services/cashfree.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { HTTP } from '@ionic-native/http/ngx';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { SMS } from '@ionic-native/sms/ngx';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateMedsurgService } from './services/translate.service';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { PhotoLibraryService } from './services/plugins/photo-library.service';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
  }
  export function LanguageLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, "assets/i18n/", ".json");
  }
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(config.firebaseConfig), 
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthGuardService,
    AuthService,
    PhotoLibrary,
    InteractionService,
    StorageService,
    ProccessHttpErrosService,
    SearchMedecinService,
    FileChooser,
    File,
    OrderService,
    ReferalService,
    MessageService,
    NavParams,
    CategoryService,
    PrescriptionService,
    CashfreeService,
    InAppBrowser,
    FirebaseX,
    TranslateMedsurgService,
    SMS,
    HTTP,
    FirebaseAuthentication,
    PhotoLibraryService,
    AndroidPermissions,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true,

    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizedInterceptor,
      multi: true
    },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {provide : 'bucketURL', useValue : config.bucket}
  ],
  bootstrap: [AppComponent]
})

export class AppModule {}
