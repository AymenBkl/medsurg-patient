import { Injectable } from '@angular/core';
import { AngularFireDatabase , AngularFireList } from '@angular/fire/database';
@Injectable({
  providedIn: 'root'
})
export class RealtimedatabaseService {

  studentsRef: AngularFireList<any>;
  constructor(private db: AngularFireDatabase) { 
    this.studentsRef = this.db.list('messages');
  }


  getData(){
    return this.db.list('messages').valueChanges().subscribe(data => {
      console.log(data);
    });
  }

  addPost() {
    this.studentsRef.push({
      name: "aymenxyzbkl",
      lastname:"xd"
    });
  }
}
