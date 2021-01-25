import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { User } from './interfaces/user';
import { Router } from '@angular/router';
import { CashfreeService } from './services/cashfree.service';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';

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


  // public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  sign: any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private router: Router,
    private cashfree: CashfreeService,
    private iab: InAppBrowser
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
    this.cashfree.checkLink('ORDER-153265555555')
      .then((result: any) => {
        console.log(result);
      })
    /**setTimeout(() => {
      this.form.nativeElement.submit();
    }, 1500)**/
    this.authService.checkJWT();
    this.menuItems();
    this.getCurrentUser();
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
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


  inAppBrowser(link) {
    const options: InAppBrowserOptions = {
      zoom: "no",
      fullscreen: "yes",
      hidenavigationbuttons: "no",
      toolbar: "no",
      hideurlbar: "yes",
    };
    const browser = this.iab.create(link, '_blank', {
      toolbar: "yes",
      hideurlbar: "yes",
      fullscreen: "yes",
      location: "no",
      closebuttoncolor: 'danger',
      closebuttoncaption: 'close',

      options,
    });

    browser.on('loadstop')
      .subscribe(event => {
        console.log(event)
        browser.show();
      })
    browser.on('loadstart')
      .subscribe(event => {
        console.log(event)
        browser.show();

      })
  }








}
