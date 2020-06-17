import { Injectable, OnDestroy } from '@angular/core';
import {  Router  } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { switchMap, first, tap } from 'rxjs/operators';

import { Observable, of } from 'rxjs';
import { User } from './user';
import { Video } from './video';
import { Audio } from './audio';

import {MatSnackBar} from '@angular/material/snack-bar';
import * as firebase from 'firebase/app'; 

const {serverTimestamp} = firebase.firestore.FieldValue;


@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy  {

  user$: Observable<any>;
  userDoc$: Observable<any>;

  user;
  userDoc;

  userSub;
  userDocSub;

  coachesMap$: Observable<any>;

  constructor(
      private afAuth:AngularFireAuth,
      private afs: AngularFirestore,
      private router: Router,
      private _snackBar: MatSnackBar
    ) {

    this.user$ = this.afAuth.authState
      .pipe(tap(u => {
        this.user = u;
      }));


    this.userDoc$ = this.getUserDoc$().pipe(tap(u => {
      this.userDoc = u;
    }));


    this.userSub = this.user$.subscribe();
    this.userDocSub = this.userDoc$.subscribe();
   }

   getUserDoc$() {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if(user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
   }

   getCoach$(userId) {
    if(userId) {
      return this.afs.doc<User>(`users/${userId}`).valueChanges();
    } else {
      return of(null);
    }
   }

  async signOut() {
    try {
      await this.afAuth.auth.signOut();
      return this.router.navigate(['/']);
    } catch(err) {
      this._snackBar.open("Ooops! Something went wrong. Please try signing out again." + this.user.email, 'Close', {
        duration: 5000,
      });
    }
  }

  public updateUserData(userFormData: User) {

    try{
      const userRef: AngularFirestoreDocument<{}> = this.afs.doc(`users/${this.user.uid}`);

      const data = Object.keys(userFormData)
        .reduce((obj, key) => {
          return {
            ...obj,
            [key]: userFormData[key]
          };
        }, {});
  
      return userRef.set(data,{ merge: true });
    } catch (error) {
      this._snackBar.open("Oooops Something went wrong! Please try again.", 'Close', {
        duration: 5000,
      });
    }
  }

  resetPassword(email: string) {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  public async signUp(form: any) {
    try {
      await this.afAuth.auth.createUserWithEmailAndPassword(form.email, form.password);
      var self = this;

      await this.afAuth.auth.signInWithEmailAndPassword(form.email, form.password).then(async function(userCredential) {
        const user = userCredential.user;
        var newUser = {};

        var phoneNumber;
        if(form.phoneNumberA != null &&  form.phoneNumberB != null && form.phoneNumberC != null) {
          phoneNumber = form.phoneNumberA + form.phoneNumberB + form.phoneNumberC;
        }

        newUser['uid'] = userCredential.user.uid;
        newUser['displayName'] = form.displayName? form.displayName: "";
        newUser['lastName'] = form.lastName ? form.lastName : "";
        newUser['email'] = form.email;
        newUser['phoneNumber'] = phoneNumber ? phoneNumber: "";
        newUser['dob'] = form.dob ? form.dob : null;
        newUser['yearsExperience'] = form.yearsExperience ? form.yearsExperience : "0";
        newUser['address1'] = form.address1 ? form.address1 : "";
        newUser['address2'] = form.address2 ? form.address2 : "";
        newUser['City'] = form.City ? form.City : "";
        newUser['State'] = form.State ? form.State : "";
        newUser['Zip'] = form.Zip ? form.Zip : "";
        newUser['photoURL'] = form.photoURL ? form.photoURL : "/profile-placeholder.png";
        newUser['credits'] = form.credits ? form.credits : 0;
        newUser['role'] = form.role ? form.role : "athlete";
        newUser['status'] = form.status ? form.status : "active";
        newUser['notifications'] = form.notifications ? form.notifications : "both";
        newUser['newUser'] = "true";

        await self.updateUserData(newUser);

        await user.sendEmailVerification();

        await self.handleSuccess(newUser);
      });
      
    } catch (error) {

      if(error.message != null) {
        this._snackBar.open(error.message, 'Close', {
          duration: 5000,
        });
      } else {
        this._snackBar.open("Unable to create User Account. Please try again or reach out to the CCS team.", 'Close', {
          duration: 5000,
        });
      }

    }
  }

  async sendNewVerificationEmail() {
    try {
      await this.user.sendEmailVerification();

      this._snackBar.open("Successfully sent new confirmation email to " + this.user.email, 'Close', {
        duration: 5000,
      });

    } catch(error) {
      console.log("Unable to send confirmation email at the moment.");
    }

  }

  async handleSuccess(form: any) {
      const message = `Welcome ${form.displayName ? form.displayName : ''}!`;
      this._snackBar.open(message, 'Close', {
        duration: 5000,
      });
      this.router.navigate(['/platform']);
  }

  async getUser() {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  updateVideoStatus(id: string, status: string, creditsCharged: number, finalCommentsForm?: any) {

    try{
      var updateObject = {'reviewStatus': status};

      if(status === 'F') {
  
        updateObject['dateReviewed'] = serverTimestamp();
  
        const userRef: AngularFirestoreDocument<{}> = this.afs.doc(`users/${this.user.uid}`);
        const increment = firebase.firestore.FieldValue.increment(1);
        const incrementCredits = firebase.firestore.FieldValue.increment(creditsCharged);
  
        userRef.update({completedReviewsCount: increment, totalCreditsEarned: incrementCredits});
  
      }
  
      if(finalCommentsForm) {
        updateObject['finalComments'] = finalCommentsForm['finalComments'];
      }
  
      const videoRef: AngularFirestoreDocument<{}> = this.afs.doc(`videos/${id}`);
      return videoRef.set(updateObject,{ merge: true });

    } catch(error) {
      this._snackBar.open("Ooops ... there was an issue updating the status of your video. Please try again.", 'Close', {
        duration: 5000,
      });
    }
      
  }

  public addVideoForUser(videoFormData: Video, downloadURL: string) { 
    try{
      videoFormData['dateUploaded'] = serverTimestamp();
      videoFormData['reviewStatus'] = "U";
      videoFormData['contentLocation'] = downloadURL;
      videoFormData['uploaderId'] = this.user.uid;
  
      const reviewer = videoFormData['reviewer'];
      const creditsCharged = parseInt((reviewer.split("|", 4)[2]), 10);
  
      videoFormData['reviewer'] = (reviewer.split("|", 4)[1]);
      videoFormData['reviewerId'] = (reviewer.split("|", 4)[0]);
      videoFormData['creditsCharged'] = creditsCharged;
  
      this.afs.collection('videos').add(videoFormData).then(function(docRef){
        docRef.get().then(function(doc) {
          return docRef.set({'id': doc.id },{ merge: true });
        });
      });
  
      const userRef: AngularFirestoreDocument<{}> = this.afs.doc(`users/${this.user.uid}`);
      const increment = firebase.firestore.FieldValue.increment(-1 * creditsCharged);
  
      //increment the credits and delete the newUser field
      return userRef.update({credits: increment, newUser: firebase.firestore.FieldValue.delete()});

    }catch(error) {
      this._snackBar.open("Ooops ... there was an issue adding your video. Please try again.", 'Close', {
        duration: 5000,
      });
    }
    
  }

  public purchaseCredits(amount: number) { 
    try{
  
      const userRef: AngularFirestoreDocument<{}> = this.afs.doc(`users/${this.user.uid}`);
      const increment = firebase.firestore.FieldValue.increment(Math.floor(amount/100));
  
      //increment the credits and delete the newUser field
      return userRef.update({credits: increment});

    }catch(error) {
      this._snackBar.open("Ooops ... this is highly unsual. There was an issue with your purchase. Please notify the CCS team right away", 'Close', {
        duration: 5000,
      });
    }
    
  }

  public addAudioForUser(AudioUploadInfo: Audio, downloadURL: string) {  
    try {
      AudioUploadInfo['dateUploaded'] = serverTimestamp();
      AudioUploadInfo['contentLocation'] = downloadURL;
      AudioUploadInfo['uploaderId'] = this.user.uid;
  
      //timestamps to are zero on the dot causes issues so lets add some decimals
      if(AudioUploadInfo['videoTime'] === 0) {
        AudioUploadInfo['videoTime'] = 0.01;
      }
  
      AudioUploadInfo['videoTime'] = Math.round(AudioUploadInfo['videoTime'] *100)/100;
  
      //timestamp & videoId also needed
  
      this.afs.collection('audio').add(AudioUploadInfo).then(function(docRef){
        docRef.get().then(function(doc) {
          return docRef.set({'id': doc.id },{ merge: true });
        });
      });

    }catch(error) {
      this._snackBar.open("Ooops ... there was an issue uploading your audio note. Please try again.", 'Close', {
        duration: 5000,
      });
    }

  }

  deleteAudioNote(row: any) {
    try {
      const self = this;
      this.afs.collection("audio").doc(row.id).delete().then(function() {
        self._snackBar.open("Successfully removed this audio file.", 'Close', {
          duration: 5000,
        });
      }).catch(function(error) {
        self._snackBar.open("There was an error deleting this audio. Please try again or contact the Coach Connect Team.", 'Close', {
          duration: 5000,
        });
      });
    } catch(error) {
      this._snackBar.open("Ooops ... there was an issue deleting your audio note. Please try again.", 'Close', {
        duration: 5000,
      });
    }

  }

  public updateCost(costFormData: any) {  
    try{

      var batch = this.afs.firestore.batch();

      const userRef: AngularFirestoreDocument<{}> = this.afs.doc(`users/${this.userDoc.uid}`);
      batch.set(userRef.ref, {'reviewPrice': costFormData['credits']},{ merge: true });
      
      const uid = this.userDoc.uid;
      const parts = this.userDoc.photoURL.split("_");
      const timestamp = parts.pop(); 
      var coachUpdate = {};
      coachUpdate[`coach-map.${uid}`] = this.userDoc.displayName + " " + this.userDoc.lastName + "|" + costFormData['credits'] + "|" + this.userDoc.status + "|" + timestamp;
      const coachMapRef = this.afs.doc(`coaches-list/XGvss7TIJmqquEMHnkrI`);
      batch.update(coachMapRef.ref, coachUpdate);
            
      return batch.commit();
    
    } catch(error) {
      this._snackBar.open("Ooops ... there was an issue updating your price. Please try again & if the issue continues contact the CCS team.", 'Close', {
        duration: 5000,
      });
    }

  }

  public updateCoachStatus(status: string) {  
    try{      
      var batch = this.afs.firestore.batch();

      const userRef: AngularFirestoreDocument<{}> = this.afs.doc(`users/${this.userDoc.uid}`);
      batch.set(userRef.ref, {'status': status},{ merge: true });
      
      const uid = this.userDoc.uid;
      var coachUpdate = {};
      const parts = this.userDoc.photoURL.split("_");
      const timestamp = parts.pop(); 

      coachUpdate[`coach-map.${uid}`] = this.userDoc.displayName + " " + this.userDoc.lastName + "|" + this.userDoc.reviewPrice + "|" + status + "|" + timestamp;
      const coachMapRef = this.afs.doc(`coaches-list/XGvss7TIJmqquEMHnkrI`);
      batch.update(coachMapRef.ref, coachUpdate);

      return batch.commit();

    }catch(error) {
      this._snackBar.open("Ooops ... there was an issue updating your status. Please try again & if the issue continues contact the CCS team.", 'Close', {
        duration: 5000,
      });
    }            
  }

  public updateCoachImg(timestamp: number, downloadURL: String) {  
    try {
      var batch = this.afs.firestore.batch();
      const userRef: AngularFirestoreDocument<{}> = this.afs.doc(`users/${this.userDoc.uid}`);
      batch.set(userRef.ref, {'photoURL' : downloadURL},{ merge: true });
      
      const uid = this.userDoc.uid;
      var coachUpdate = {};
      coachUpdate[`coach-map.${uid}`] = this.userDoc.displayName + " " + this.userDoc.lastName + "|" + this.userDoc.reviewPrice + "|" + this.userDoc.status + "|" + timestamp;
      const coachMapRef = this.afs.doc(`coaches-list/XGvss7TIJmqquEMHnkrI`);
      batch.update(coachMapRef.ref, coachUpdate);

      return batch.commit();

    } catch(error) {
      this._snackBar.open("Ooops ... there was an issue updating profile picture. Please try again.", 'Close', {
        duration: 5000,
      });
    }
          
}

  async updateEmail(email: string, password: string) {
      const self = this;

      await this.afAuth.auth.signInWithEmailAndPassword(this.userDoc.email, password).then(async function(userCredential) {
        await userCredential.user.updateEmail(email).then(()=>{
          const userRef: AngularFirestoreDocument<{}> = self.afs.doc(`users/${self.userDoc.uid}`);
          return userRef.set({'email' : email},{ merge: true });
        });
      });
  }

  public addProfilePicForUser(downloadURL: String, timestamp: any) {  
    try{
      const userRef: AngularFirestoreDocument<{}> = this.afs.doc(`users/${this.user.uid}`);

      if(this.userDoc.role === 'coach') {
        return this.updateCoachImg(timestamp, downloadURL);
      } else {
        return userRef.set( {'photoURL' : downloadURL} , { merge: true });  
      }
  
    } catch(error) {
      this._snackBar.open("Ooops ... there was an issue updating your profile picture. Please try again & if the issue continues please contact the CCS team.", 'Close', {
        duration: 5000,
      });
    }
  
  }

  public getCoachesForDropdown() {
      this.coachesMap$ = this.afs.doc(`coaches-list/XGvss7TIJmqquEMHnkrI`).valueChanges();
  }

  ngOnDestroy() {
    if(this.userSub) {
      this.userSub.unsubscribe();
    }

    if(this.userDocSub) {
      this.userDocSub.unsubscribe();
    }
  }

}
