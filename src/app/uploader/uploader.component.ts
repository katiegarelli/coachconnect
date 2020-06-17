import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AuthService } from '../core/auth.service';
import * as tus from 'tus-js-client';
import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { retry, catchError } from 'rxjs/operators';

export interface VideoData {
  file: File, 
  videoURL: any,
}

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent {

  isHovering: boolean;
  video : VideoData;

  @Output() videosUploadedEvent = new EventEmitter<VideoData>();

  constructor( private http: HttpClient, private _snackBar: MatSnackBar, private auth: AuthService, private functions: AngularFireFunctions ) {}


  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(files: FileList) {
    //add the files to the files array
    if(files.length == 1) {

      //check that we uploaded a video
      var mimeType = files[0].type;
      if (mimeType.match(/video\/*/) == null) {
        console.log("Please upload a video.");

        this._snackBar.open("Please upload a video.", 'Close', {
          duration: 5000,
        });

        return;
      }

      var reader = new FileReader();
      reader.readAsDataURL(files[0]); 
      reader.onload = (_event) => { 
        this.videoChange({
          'file' : files.item(0),
          'videoURL' : typeof reader.result === "string"? reader.result : reader.result.toString()
        });
      }

    } else if(files.length > 1) {
      this._snackBar.open("Please upload only one video at a time.", 'Close', {
        duration: 5000,
      });
    }
  }

  videoChange(video: VideoData) {
    //currently setting the limit to 1 GB
    if(video.file.size > 1000000000) {
      this._snackBar.open("Your video exceeds the 1GB limit. Reach out to the CSS team with any questions.", 'Close', {
        duration: 5000,
      });

      this.video = null;
      this.videosUploadedEvent.emit(null);
    } else {
      this.video = video;
      this.videosUploadedEvent.emit(video);
    }
  }

  removeVideo() {
    this.video = null;
    this.videosUploadedEvent.emit(null);
  }



}
