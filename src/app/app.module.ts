import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import {HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthGuardService } from './services/auth-guard.service';
import { InteractionService } from './services/interaction.service';
import { InterceptorService, UnauthorizedInterceptor } from './services/interceptor.service';
import { AuthService } from './services/auth.service';
import { StorageService } from './services/storage.service';
import { ProccessHttpErrosService } from './services/proccess-http-erros.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthGuardService,
    AuthService,
    InteractionService,
    StorageService,
    ProccessHttpErrosService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizedInterceptor,
      multi: true
    },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
