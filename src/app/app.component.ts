import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { User } from './interfaces/user';
import { Router } from '@angular/router';
import { CashfreeService } from './services/cashfree.service';
import { HttpParams } from '@angular/common/http';
import { config } from './services/config';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public isAuth: any;
  public user: User;
  public appPages = [
    {
      title: 'Home',
      url: 'home',
      icon: 'home',
      auth: true
    },
    {
      title: 'Profile',
      url: 'profile',
      icon: 'people-circle',
      auth: true
    },
    {
      title: 'Prescriptions',
      url: 'prescription',
      icon: 'document',
      auth: true
    },
    {
      title: 'Find Medecins',
      url: 'search-medecin',
      icon: 'search',
      auth: true
    },
    {
      title: 'Referals',
      url: 'referal',
      icon: 'link',
      auth: true
    },
    {
      title: 'Orders',
      url: 'orders',
      icon: 'cart',
      auth: true
    },

    {
      title: 'Login',
      url: 'login',
      icon: 'log-in',
      auth: false
    },
    {
      title: 'Register',
      url: 'register',
      icon: 'document-text',
      auth: false
    },
    {
      title: 'Logout',
      url: 'log-out',
      icon: 'log-out',
      auth: true,
    }
  ];

  public appSupport = [
    {
      title: 'Contact Admin',
      url: 'messages',
      icon: 'chatbubble',
      auth: true
    },

  ];

  data = {
    "appId": config.cashfree.appId,
    "orderId": 'ORDER-15326',
    "orderAmount": "150",
    "orderCurrency": 'INR',
    "orderNote": "TEST",
    "customerName": "AYMEN BKL",
    "customerPhone": '9177091554',
    "customerEmail": 'sada@sada.dz',
    "returnUrl": 'http://localhost:8100/orders',
    "notifyUrl": 'http://localhost:8100/orders',
  };
  @ViewChild('redirectForm') form: ElementRef;
  // public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  sign: any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private router: Router,
    private cashfree: CashfreeService
  ) {

    this.initializeApp();
  }



  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    this.sign = this.sortData();
    console.log(this.sign);
    console.log(this.data);
    setTimeout(() => {
      this.form.nativeElement.submit();
    }, 1500)
    this.authService.checkJWT();
    this.menuItems();
    this.getCurrentUser();
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }
  ionViewDidEnter() {
    console.log(this.form);
  }

  menuItems() {
    this.isAuth = this.authService.user ? true : false;
    this.authService.authenticated
      .subscribe(authenticated => {
        console.log(authenticated);
        this.isAuth = authenticated;
      });
  }
  getCurrentUser() {
    this.authService.getCurrentUser()
      .subscribe(user => {
        this.user = user;
      });
  }

  logOut() {
    this.authService.logOut()
      .then(() => {
        this.router.navigate(['/login']);
      }).catch(() => {
        this.router.navigate(['/login']);
      });
  }



  sortData() {
    var tuples = [];

    for (var key in this.data) tuples.push([key, this.data[key]]);

    tuples.sort(function (a, b) {
      a = a[0];
      b = b[0];

      return a < b ? -1 : (a > b ? 1 : 0);
    });
    let newData = {}
    for (var i = 0; i < tuples.length; i++) {
      newData[tuples[i][0]] = tuples[i][1] ;
    }
    return this.cashfree.generateSignatuer(newData);
  }


}
