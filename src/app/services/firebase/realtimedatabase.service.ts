import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase';
import { map } from 'rxjs/operators';
import { Prescription } from 'src/app/interfaces/prescription';
import { User } from 'src/app/interfaces/user';
@Injectable({
  providedIn: 'root'
})
export class RealtimedatabaseService {

  postRef: AngularFireList<any>;
  constructor(private db: AngularFireDatabase,
              private storage: AngularFireStorage) { }


  getData(userId) {
    return this.db.list('posts/' + userId).snapshotChanges()
      .pipe(map(action => action
        .map(a => Object.keys(a.payload.val())
          .map(posts => {
            const val = a.payload.val()[posts];
            const data = {
              key: posts,
              user_id: val.user_id,
              userFullName: val.userFullName,
              description: val.description,
              date: val.date,
              userImage: val.userImage,
              imageUrl: val.imageUrl,
              comments: []
            };
            this.getComment(posts)
              .then((comments: any) => {
                console.log(comments);
                data.comments = comments;
              });
            return data;
          })
        )));
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

  updatePost(prescription: Prescription) {
    return new Promise((resolve, reject) => {
      this.db.object('posts/' + prescription.user_id + '/' + prescription.key).update(prescription)
        .then(result => {
          console.log(result);
          resolve(true);
        })
        .catch(err => {
          reject(err);
        });
    });
  }


  uploadFile(file) {
    const fileName = file.name;
    const fileRef = this.storage.ref('').child('images/' + fileName);
    const metadata = { contentType: file.type };
    const uploadTask = fileRef.put(file, metadata);
    return new Promise((resolve, reject) => {
      uploadTask.then(() => {
        fileRef.getDownloadURL().subscribe(url => {
          resolve(url);
        });
      });
    });
  }

  getComment(key) {
    return new Promise((resolve, reject) => {
      this.db.list('comments/' + key)
        .valueChanges().subscribe(
          data => {
            resolve(data);
          });
    });
  }
}
