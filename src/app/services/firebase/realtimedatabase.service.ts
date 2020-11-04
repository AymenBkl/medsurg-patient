import { Injectable } from '@angular/core';
import { AngularFireDatabase , AngularFireList } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase';
import { Prescription } from 'src/app/interfaces/prescription';
import { User } from 'src/app/interfaces/user';
@Injectable({
  providedIn: 'root'
})
export class RealtimedatabaseService {

  postRef: AngularFireList<any>;
  constructor(private db: AngularFireDatabase,
              private storage: AngularFireStorage) {}


  getData(){
    return this.db.list('posts').valueChanges().subscribe(data => {
      console.log(data);
    });
  }

  addPost(prescription: Prescription) {
    return new Promise((resolve, reject) => {
    this.postRef = this.db.list('posts/' + prescription.user_id);
    this.postRef.push(prescription)
      .then(data => {
        resolve(true);
      })
      .catch(err => {
        reject(err);
      });
    });
  }

  uploadFile(file){
    const fileName = file.name;
    const fileRef = this.storage.ref('').child('images/' + fileName);
    const metadata = { contentType: file.type};
    const uploadTask = fileRef.put(file, metadata);
    return new Promise((resolve, reject) => {
      uploadTask.then(() => {
        fileRef.getDownloadURL().subscribe(url => {
          resolve(url);
        });
      });
    });
  }
}
