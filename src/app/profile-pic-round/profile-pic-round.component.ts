import { Component, Input, ViewChild } from '@angular/core';
import { FileUploadService } from '../file-upload.service'
import {MatSnackBar} from '@angular/material/snack-bar';
import { AuthService } from '../core/auth.service';
import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';
import { Observable } from 'rxjs';
import { AngularFireAnalytics } from '@angular/fire/analytics';

@Component({
  selector: 'app-profile-pic-round',
  templateUrl: './profile-pic-round.component.html',
  styleUrls: ['./profile-pic-round.component.scss']
})
export class ProfilePicRoundComponent {

  // need this for the drag and drop input of a new picture
  isHovering: boolean = false;

  //need to keep track of edit mode, this will be set by the parent component
  @Input()
  private editmode = false;

  //keeps track of whether a new image was uploaded in edit mode
  private pictureChanged: boolean = false;

  //percentage of file upload
  percentage$: Observable<number>;

  //url of the saved image
  savedImageUrl: any;

  //keeps track of whether or not the image has been updated so we know to reload it
  timeStamp: any;

  //needed for the cropper
  data: any;
  cropperSettings: CropperSettings;
  @ViewChild('cropper', {static: false}) cropper:ImageCropperComponent;

  isLoading: boolean = true;


  constructor(public analytics: AngularFireAnalytics, private uploader: FileUploadService, private _snackBar: MatSnackBar, public auth: AuthService) {
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.width = 100;
    this.cropperSettings.height = 100;
    this.cropperSettings.minWidth = 100;
    this.cropperSettings.minHeight = 100;
    this.cropperSettings.croppedWidth = 200;
    this.cropperSettings.croppedHeight = 200;
    this.cropperSettings.canvasWidth = 300;
    this.cropperSettings.canvasHeight = 300;
    this.cropperSettings.rounded = true;
    this.cropperSettings.noFileInput = true;

    this.data = {};
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(files: FileList) {
    //add the files to the files array
    for(let i = 0; i < files.length; i++) {

      //check that we uploaded a video
      var mimeType = files[0].type;
      if (mimeType.match(/image\/*/) == null) {
        console.log("Please upload an image.");

        this._snackBar.open("Please upload an image.", 'Close', {
          duration: 5000,
        });

        this.analytics.logEvent('profile_pic_not_an_img', {'mimeType': mimeType}) 

        return;
      }

      var reader = new FileReader();
      var image: any = new Image();
      var that = this;

      reader.onloadend = (_event) => { 
        that.pictureChanged = true;
        image.src = (<FileReader>_event.target).result;
        that.cropper.setImage(image);
      }

      reader.readAsDataURL(files[0]); 
      this.analytics.logEvent('profile_pic_img_dropped', {'mimeType': mimeType}) 

    }
  }

  public edit():void {
    this.editmode = true;
    this.pictureChanged = false;
    this.savedImageUrl = '';
    this.analytics.logEvent('profile_pic_edit_img_clicked', {}) 
  }

  async save(user: string, currentPhotoPath: string) {
    this.editmode = false;

    if(this.data.image) {
      this.savedImageUrl = await this.uploader.startProfilePicUpload(this.data.image, user, currentPhotoPath);
    }
    this.analytics.logEvent('profile_pic_saved', {}) 
  }

  public cancel():void {
    this.editmode = false;
    this.pictureChanged = false;
    this.analytics.logEvent('profile_pic_img_cancel', {}) 
  }

  public getImageUrl(url: any): string {
    if(this.savedImageUrl) {
      return this.savedImageUrl;
    }
    return url;
  }

}