import { Injectable } from '@angular/core';
import { AngularFireDatabase , AngularFireList } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase';
@Injectable({
  providedIn: 'root'
})
export class RealtimedatabaseService {

  postRef: AngularFireList<any>;
  constructor(private db: AngularFireDatabase,
              private storage: AngularFireStorage) { 
    this.postRef= this.db.list('posts');
  }


  getData(){
    return this.db.list('posts').valueChanges().subscribe(data => {
      console.log(data);
    });
  }

  addPost() {
    this.postRef.push({
      name: "aymenxyzbkl",
      lastname:"xd"
    });
  }

  uploadFile(file){
    const fileName = file.name;
    const fileRef = this.storage.ref('').child('images/' + fileName);
    const metadata = { contentType: file.type};
    const uploadTask = fileRef.put(file, metadata);
    return new Promise((resolve, reject) => {
      uploadTask.then( function (downloadURL) {
        fileRef.getDownloadURL().subscribe(url => {
          resolve(url);
        });
      });
    });
  }
}
