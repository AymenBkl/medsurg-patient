import { Injectable } from '@angular/core';
import { ImagePicker } from '@ionic-native/image-picker/ngx';

@Injectable({
  providedIn: 'root'
})
export class CameraUploadService {

  constructor(private imagePicker: ImagePicker) { }


  openGallery(index: number) {
    return new Promise((resolve, reject) => {
      let options = {
        maximumImagesCount: 1,
        width: 500,
        height: 500,
        quality: 100,
        outputType: 1
      }

      this.imagePicker.getPictures(options).then(
        file_uris => {
          console.log(file_uris);
          resolve(this.selectedImage('data:image/jpeg;base64,' + file_uris, index))
        },

        err => console.log('uh oh')
      );
    })

  }

  private convertBase64ToBlob(base64Image: string) {
    console.log(base64Image);
    // Split into two parts
    const parts = base64Image.split(';base64,');
    console.log(parts[1])
    // Hold the content type
    const imageType = parts[0].split(':')[1];
    console.log(imageType)
    // Decode Base64 string 
    const decodedData = atob(parts[1]);

    // Create UNIT8ARRAY of size same as row data length
    const uInt8Array = new Uint8Array(decodedData.length);

    // Insert all character code into uInt8Array
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i);
    }

    // Return BLOB image after conversion
    return new Blob([uInt8Array], { type: imageType });
  }


  selectedImage(base64Data: string, index: number) {
    console.log(index);
    return this.preview(this.convertBase64ToBlob(base64Data), index);
  }

  preview(file, index: number) {
    return new Promise((resolve, reject) => {
      console.log(file)
      if (!file) {
        return resolve('not file');
      }
      const mimeType = file.type;
      if (mimeType.match(/image\/*/) == null) {
        return resolve('not image');
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        resolve({ url: reader.result, file: file })
      };
    })

  }
}
