import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase';
import { off } from 'process';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Offer } from 'src/app/interfaces/offer';
import { Prescription } from 'src/app/interfaces/prescription';
import { User } from 'src/app/interfaces/user';
import { Comment } from 'src/app/interfaces/comment';

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
        .map((a: any) => {
          const val = a.payload.val();
          const data = {
            key: a.payload.key,
            user_id: val.user_id,
            userFullName: val.userFullName,
            description: val.description,
            date: val.date,
            userImage: val.userImage,
            imageUrl: val.imageUrl,
            comments: [],
            status:val.status
          };
          this.getComment(a.payload.key)
            .subscribe((comments: any) => {
              data.comments = comments;
            });
          return data;
        })
      ));
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

  createOffer(offer: Offer, currentUser:User){
    return new Promise((resolve, reject) => {
      this.postRef = this.db.list('offers/' + currentUser._id);
      this.postRef.push(offer)
        .then(data => {
          resolve(true);
          this.updateComment(offer.commentId,offer.prescriptionId,'accepted');
          this.updatePrescription(currentUser._id,offer.prescriptionId,'accepted');
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  updateComment(commentId: string,PrescriptionId: string,status:string){
    return new Promise((resolve, reject) => {
      this.db.object('comments/' + PrescriptionId + '/' + commentId).update({status:status})
        .then(result => {
          console.log(result);
          resolve(true);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  updatePrescription(userId: string,PrescriptionId: string,status:string){
    return new Promise((resolve, reject) => {
      this.db.object('posts/' + userId + '/' + PrescriptionId).update({status:status})
        .then(result => {
          console.log(result);
          resolve(true);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  getComment(key) {
    return new Observable((obvserver) => {
      this.db.list('comments/' + key)
        .snapshotChanges()
        .pipe(map(action => action
          .map((a: any) => {
            const val = a.payload.val();
            let comment: Comment = {
              commentId: a.key,
              comment: val.comment,
              date: val.date,
              postKey: val.postKey,
              status: val.status,
              userFullName:val.userFullName,
              userImage: val.userImage,
              user_id: val.user_id
            }
            return comment;            
          }))).subscribe(data => {
              obvserver.next(data);
          })})
}

getOffers(userId:string){
  return this.db.list('offers/' + userId )
  .snapshotChanges()
  .pipe(map(action => action
    .map((a: any) => {
      const val = a.payload.val();
      let offer = {
        commentId: val.commentId,
        date: val.date,
        key: a.key,
        offer: val.offer,
        method: val.method,
        patient_id: val.patient_id,
        pharmacyId: val.pharmacyId,
        status:val.status,
        prescriptionId:val.prescriptionId,
        prescription: null
      }
      this.db.object('posts/' +  userId + '/' + val.prescriptionId).valueChanges()
        .subscribe(prescription => {
          offer.prescription = prescription;
        })            
      return offer;
    })));
}
}
