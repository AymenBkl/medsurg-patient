import { Injectable } from '@angular/core';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';

@Injectable({
  providedIn: 'root'
})
export class PhotoLibraryService {

  constructor(private photoLibrary: PhotoLibrary) { }



  getPhotos(){
    this.photoLibrary.requestAuthorization().then(() => {
      this.photoLibrary.getLibrary((result) => {
        var library = result.library;
        library.forEach(function(libraryItem) {
          console.log(libraryItem.id);          // ID of the photo
          console.log(libraryItem.photoURL);    // Cross-platform access to photo
          console.log(libraryItem.thumbnailURL);// Cross-platform access to thumbnail
          console.log(libraryItem.fileName);
          console.log(libraryItem.width);
          console.log(libraryItem.height);
          console.log(libraryItem.creationDate);
          console.log(libraryItem.latitude);
          console.log(libraryItem.longitude);
          console.log(libraryItem.albumIds);    // array of ids of appropriate AlbumItem, only of includeAlbumsData was used
        });
      })
    })
    .catch(err => console.log('permissions weren\'t granted'))
  }
}
