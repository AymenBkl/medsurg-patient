import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Prescription } from '../interfaces/prescription';
import { PrescriptionResponse } from '../interfaces/prescriptionResponse';
import { config } from './config';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {

  prescriptionURL= config.baseURL + "crm/";
  constructor(private httpClient: HttpClient) { }


  createPrescription(prescription: Prescription) {

    return new Promise((resolve, reject) => {
    this.httpClient.post<PrescriptionResponse>(this.prescriptionURL + 'prescription', prescription)
      .subscribe(response => {
        if (response.status === 200) {
          resolve(response.prescription);
        }
        else {
          resolve(false);
        }
      }, err => {
        reject(err);
      });
    });
  }
  postImage(formData: FormData, prescriptionId) {

    return new Promise((resolve, reject) => {
    this.httpClient.post<PrescriptionResponse>(this.prescriptionURL + 'prescriptionfiles/addimage/' + prescriptionId, formData)
      .subscribe(response => {
        if (response.status === 200) {
          resolve(response.prescription);
        }
        else {
          resolve(false);
        }
      }, err => {
        reject(err);
      });
    });
  }
}
