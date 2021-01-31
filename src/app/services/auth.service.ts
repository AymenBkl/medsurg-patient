import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../interfaces/user';
import { config } from './config';
import { StorageService } from './storage.service';
import { ProccessHttpErrosService } from './proccess-http-erros.service';
import { AuthResponse} from '../interfaces/response';
import { catchError } from 'rxjs/operators';
import { PaymentDetail } from '../interfaces/paymentDetail';

@Injectable({
  providedIn: 'root'
})

export class AuthService {


  authURL = config.baseURL + 'account/';
  private currentUser: Subject<User> = new Subject<User>();
  user: User;
  authenticated: Subject<boolean> = new Subject<false>();
  isAuthenticated = false;
  constructor(private httpClient: HttpClient,
              private storageService: StorageService,
              private httpErrorHandler: ProccessHttpErrosService) {
               }

  checkJWT() {
    return new Promise((resolve,reject) => {
      const token = this.storageService.getToken();
      if (token){
        console.log(token);
        this.httpClient.get<AuthResponse>(this.authURL + 'jwt')
        .subscribe(response => {
          console.log(response);
          if (response.token === 'TOKEN VALID' && response.status === 200){
            response.user.token = token;
            this.setUserCredentials(response.user);
            resolve(true);
          }
          else {
            this.destroyUserCredentials();
            resolve(false);
          }
        }, err => {
          console.log(err);
          reject(err);
          this.destroyUserCredentials();
        });
      }
    else {
      resolve(false);
      this.destroyUserCredentials();
    }
    })
    
}

  signUp(user: User) {
    return new Promise((resolve, reject) => {
      this.httpClient.post<AuthResponse>(this.authURL + 'signup', user)
        .subscribe(response => {
          this.storageService.removeUser();
          if (response.status === 200) {
            user.token = response.token;
            this.setUserCredentials(user);
            resolve(response);
          }
          else {
            this.destroyUserCredentials();
            resolve(false);
          }
        }, err => {
          this.destroyUserCredentials();
          reject(this.httpErrorHandler.handleError(err));
        });
    });
  }

  logIn(user: any) {
    return new Promise((resolve, reject) => {
      this.destroyUserCredentials();
      this.httpClient.post<AuthResponse>(this.authURL + 'login', {phoneNumber : user.phoneNumber , password : user.password})
        .subscribe(response => {
          if (response.status === 200){
            if (user.remember === false){
              this.setUserCredentials(response.user);
            }
            else {
              response.user.token = response.token;
              this.setUserCredentials(response.user);
            }
            resolve(response.user);
          }
          else {
            this.destroyUserCredentials();
            resolve(false);
          }
        }, err => {
          this.destroyUserCredentials();
          reject(this.httpErrorHandler.handleError(err));
        });
    });
  }

  logOut(){
    return new Promise((resolve, reject) => {
        this.destroyUserCredentials();
        resolve(true);
    });
  }

  destroyUserCredentials() {
    this.isAuthenticated = false;
    this.user = null;
    this.currentUser.next(null);
    this.authenticated.next(false);
    this.storageService.removeUser();
  }

  setUserCredentials(user){
    this.isAuthenticated = user.role === 'patient';
    this.user = user;
    this.currentUser.next(user);
    this.authenticated.next(true);
    this.storageService.storeUser(user);
  }

  getCurrentUser() {
    setTimeout(() => {
      this.currentUser.next(this.user);
    }, 1000);
    return this.currentUser;
  }

  userUpdated(user) {
    user.token = this.user.token;
    this.user = user;
    console.log(user);
    this.currentUser.next(user);
  }

  paymentUpdated(paymentDetail: PaymentDetail){
    this.user.paymentDetail = paymentDetail;
  }

}
