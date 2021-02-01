import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from '../config';
import { Message } from 'src/app/interfaces/message';
import { MessageResponse } from 'src/app/interfaces/messageResponse';
import { Subject } from 'rxjs';
import { ReferalResponse } from 'src/app/interfaces/referalResponse';
import { Referal } from 'src/app/interfaces/referal';
@Injectable({
  providedIn: 'root'
})
export class ReferalService {

  referalUrl = config.baseURL + "crm/referal/";
  referal: Referal;
  referalSubject: Subject<Referal> = new Subject<Referal>();
  constructor(private httpClient: HttpClient) { }


  createReferl(referalCode: string) {
    return new Promise((resolve, reject) => {
      this.httpClient.post<ReferalResponse>(this.referalUrl + 'createreferal', {code: referalCode})
        .subscribe(response => {
          console.log(response);
          if (response.status === 200) {
            this.referal = response.message;
            this.referalSubject.next(this.referal);
            resolve(response.message);
          }
          else {
            resolve(false);
          }
        }, err => {
          console.log(err);
          resolve(false)
        });
      });
  }

  getReferal(){
    return new Promise((resolve, reject) => {
      this.httpClient.get<ReferalResponse>(this.referalUrl + 'getreferal')
        .subscribe(response => {
          console.log(response);
          if (response.status === 200) {
            this.referal = response.message;
            this.referalSubject.next(this.referal);
            resolve(response.message);
          }
          else {
            resolve(false);
          }
        }, err => {
          if (err.status == 404) {
            resolve(false)
          }
          else {
            reject(err);
          }
        });
      });
  }

  checkReferal(referalCode: string) {
    return new Promise((resolve, reject) => {
      this.httpClient.post<ReferalResponse>(this.referalUrl + 'checkreferal',{code: referalCode})
        .subscribe(response => {
          console.log(response);
          if (response.status === 200) {
            resolve(response.message);
          }
          else {
            resolve(false);
          }
        }, err => {
          if (err.status == 404) {
            resolve(false)
          }
          else {
            reject(err);
          }
        });
      });
  }


  getReferalSubject() {
    this.referalSubject.next(this.referal);
    return this.referalSubject;
  }
}
