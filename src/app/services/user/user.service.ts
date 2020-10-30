import { Injectable } from '@angular/core';
import { config } from '../config';
import { HttpClient } from '@angular/common/http';
import { AuthResponse } from '../../interfaces/response';
import { ProccessHttpErrosService } from '../proccess-http-erros.service';
import { AuthService } from '../auth.service';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  userUrl = config.baseURL + 'users/user/';
  constructor(private httpClient: HttpClient,
              private proccessHttpErrorService: ProccessHttpErrosService,
              private authService: AuthService) { }


  public getUser(userId: any) {
    return new Promise((resolve, reject) => {
      this.httpClient.get<AuthResponse>(this.userUrl + userId)
        .subscribe(response => {
          if (response.status === 200) {
            this.authService.userUpdated(response.user);
            resolve(response.user);
          }
          else {
            resolve(false);
          }
        }, err => {
          reject(this.proccessHttpErrorService.handleError(err));
        });
    });
  }

  postImage(formData: FormData) {
    return new Promise((resolve, reject) => {
    this.httpClient.post<AuthResponse>(this.userUrl + 'uploadimage', formData)
      .subscribe(response => {
        if (response.status === 200) {
          this.authService.userUpdated(response.user);
          resolve(response.user.imageUrl);
        }
        else {
          resolve(false);
        }
      }, err => {
        reject(err);
      });
    });
  }

  updateUser() {
    return new Promise((resolve, reject) => {
      this.httpClient.put<AuthResponse>(this.userUrl + 'setup', {setup : true})
        .subscribe(response => {
          if (response.status === 200){
            this.authService.userUpdated(response.user);
            resolve(response.user);
          }
          else {
            resolve(false);
          }
        }, err => {
          reject(err);
        });
    });
  }

  sendVerificationEmail(emails, types , newEmail){
    return new Promise((resolve, reject) => {
      this.httpClient.post<AuthResponse>(this.userUrl + 'sendemail', {email: emails , type : types , emailNew : newEmail})
        .subscribe(response => {
          if (response.status === 200){
            resolve(true);
          }
          else {
            resolve(false);
          }
        }, err => {
          reject(err);
        });
    });
  }

  verifyEmail(code, emails ){
    return new Promise((resolve, reject) => {
      this.httpClient.post<AuthResponse>(this.userUrl + 'verify', {currenctCode : code, email: emails})
        .subscribe(response => {
          if (response.status === 200){
            resolve(true);
          }
          else if (response.status === 422){
            resolve(false);
          }
          else {
            resolve(false);
          }
        }, err => {
          if (err.status === 422) {
            resolve(false);
          }
          else {
            reject(err);
          }
        });
    });
  }
}
