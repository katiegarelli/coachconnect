import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from './core/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as tus from 'tus-js-client';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AngularFireFunctions } from '@angular/fire/functions';

export interface VideoData {
  file: File, 
  videoURL: any,
}

@Injectable({
  providedIn: 'root'
})
export class FileUploadService implements OnDestroy{

  task: AngularFireUploadTask;
  downloadURL: Observable<string>;
  vimeoUploadSubscription: any;

  constructor(private functions: AngularFireFunctions, private http: HttpClient, private storage: AngularFireStorage, private db: AngularFirestore, private auth: AuthService, private _snackBar: MatSnackBar) { }

  async uploadVideo(video: VideoData, VideoUploadForm: any) {
      const user = await this.auth.getUser();
      const videoFile: File = video.file;
      const fileSize = videoFile.size;
      const self = this;

      return new Promise(async(resolve, reject) => {
        const fun = this.functions.httpsCallable('uploadVideo');
        await fun({ 'size': video.file.size, 'uid': user.uid }).toPromise().then((response)=> {
            var upload = new tus.Upload(videoFile, {
              endpoint: 'none',
              uploadSize: fileSize,
              retryDelays: [0, 1000, 3000, 5000],
              onError: function (error: any) {
                console.log('Error completing video upload. Failed because: ', error)
                reject('error');
              },
              onProgress: function (bytes_uploaded : any, bytes_total: any) {
                var percentageUploaded = (bytes_uploaded / bytes_total * 100).toFixed(2)
                // console.log(bytes_uploaded, bytes_total, percentageUploaded + '%')
              },
              onSuccess: function () {
                const videoId = JSON.parse(response)['link'].replace("https://vimeo.com/", "");

                return self.auth.addVideoForUser(VideoUploadForm, videoId).then(function(){
                  resolve('success');
                });
                
              },
            });

            upload.url = JSON.parse(response)['upload']['upload_link'];
            upload.start()

          });
      });
  }


  startAudioUpload(blob: Blob, AudioUploadInfo : any) {
    try {
      // add a date to the path because if we upload 2 blobs with the same name 
      // then the latest blob will override the new one
      const audioDate = new Date().getTime();

      const path = `audio/${this.auth.user.uid}_${audioDate}_${AudioUploadInfo.videoId}`;

      var self = this;
      return this.storage.upload(path, blob).then(function(snapshot){
        self.auth.addAudioForUser(AudioUploadInfo, path);
      });
    } catch(error) {
      self._snackBar.open("Ooops.. we were unable to upload your audio note. Please try again or Contact the CCS team.", 'Close', {
        duration: 5000,
      });
    }


  }

  audioDelete(row: any) {

    // add a date to the path because if we upload 2 blobs with the same name 
    // then the latest blob will override the new one
    const path = `${row.contentLocation}`;

    //refrence to the storge bucket
    const contentRef = this.storage.ref(path);

    const self = this;
    // Delete the file
    contentRef.delete().toPromise().then(function() {
      // delete the data for the audio file too
      self.auth.deleteAudioNote(row);
    }).catch(function(error) {
      self._snackBar.open("There was an error deleting this audio. Please try again or contact the Coach Connect Team.", 'Close', {
        duration: 5000,
      });
    });
  }

  async startProfilePicUpload(base64img: string, name: string, currentPhotoPath: string) {

    //get the reference to the old image so we can delete it
    var oldRef = this.storage.ref(currentPhotoPath);

    // add a date to the path because if we upload 2 files with the same name 
    // then the latest file will override the new one
    const dateImg = new Date().getTime();
    const path = `profilePictures/${name}_${dateImg}`;

    //refrence to the storge bucket
    var ref = this.storage.ref(path);

    const self = this;

    if(currentPhotoPath !== "/profile-placeholder.png") {
      // delete the old image and upload the new one
      return oldRef.delete().toPromise().then(function() {

        return ref.putString(base64img, 'data_url').then(function(snapshot){
          self.auth.addProfilePicForUser(path, dateImg);
          return snapshot.ref.getDownloadURL();
        });
          
      }).catch(function(error) {
  
        //still upload it if we get an error, this just means this is the first time the user is uploading a prof-pic
        return ref.putString(base64img, 'data_url').then(function(snapshot){
          self.auth.addProfilePicForUser(path, dateImg);
          return snapshot.ref.getDownloadURL();
        });
  
      }); 

    } else {
      // otherwise we just want to upload the new one
      //TODO: make sure no one has delete permissions to placeholder.png
      return ref.putString(base64img, 'data_url').then(function(snapshot){
        self.auth.addProfilePicForUser(path, dateImg);
        return snapshot.ref.getDownloadURL();
      });

    }

  }

  ngOnDestroy() {
    if(this.vimeoUploadSubscription) {
      this.vimeoUploadSubscription.unsubscribe();
    }
  }
  
}

