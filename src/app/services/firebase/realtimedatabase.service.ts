import { Injectable } from '@angular/core';
import { AngularFireDatabase , AngularFireList } from '@angular/fire/database';
@Injectable({
  providedIn: 'root'
})
export class RealtimedatabaseService {

  postRef: AngularFireList<any>;
  constructor(private db: AngularFireDatabase) { 
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
}
