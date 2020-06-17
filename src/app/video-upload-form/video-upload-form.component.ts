import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import { ConfigService } from '../config.service';
import { AuthService } from '../core/auth.service';
import { FileUploadService } from '../file-upload.service'
import { HttpHeaders,HttpClient } from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AngularFireAnalytics } from '@angular/fire/analytics';

export interface VideoData {
  file: File, 
  videoURL: any,
}

@Component({
  selector: 'app-video-upload-form',
  templateUrl: './video-upload-form.component.html',
  styleUrls: ['./video-upload-form.component.scss']
})
export class VideoUploadFormComponent implements OnInit {

  @ViewChild('uploader', {static: false}) childUploader:any;

  data;
  video : VideoData;
  videoUploaded : boolean = false;
  loading: boolean = false;

  constructor(public analytics: AngularFireAnalytics, private _snackBar: MatSnackBar, private http: HttpClient, private uploader: FileUploadService, public auth: AuthService, private config: ConfigService, public dialogRef: MatDialogRef<VideoUploadFormComponent>) { 

    this.data = this.config.getConfig().videoUploadFormFields;
  }

  ngOnInit() {
    //if the observable isnt initialized, initialize it
    if(!this.auth.coachesMap$) {
      this.auth.getCoachesForDropdown();
      this.analytics.logEvent('get_coaches_for_dropdown', {});
    }
  }

  submitVideoUpload(VideoUploadForm: any) {
    this.loading = true;
    var self = this;
    try{
      this.uploader.uploadVideo(this.video, VideoUploadForm.value).then(
        (val) => {
          this.dialogRef.close(); 
          this.loading = false;
          self._snackBar.open("Successfully Uploaded your video!! Your reviewer has been notified and will start reviewing ASAP.", 'Close', {
            duration: 5000,
          });
        },
        (err) => {
          this.dialogRef.close();
          this.loading = false;
          self._snackBar.open("Ooops.. we were unable to upload your video. Please try again or Contact the CCS team.", 'Close', {
            duration: 5000,
          });
        }
      );
      this.analytics.logEvent('submit_video_upload_form', {});
    } catch(e) {
      this.dialogRef.close();
      this.loading = false;
      self._snackBar.open("Ooops.. we were unable to upload your video. Please try again or Contact the CCS team.", 'Close', {
        duration: 5000,
      });
    }
  }

  //triggered once the video is uploaded
  receiveVideos($event) {
    this.video = $event;
    this.videoUploaded = this.video ? true : false;
    this.analytics.logEvent('video_added_to_upload_form', {});
  }

}
