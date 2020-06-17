import { Component, Input } from '@angular/core';
import { AuthService } from '../core/auth.service';
import {MatDialog} from '@angular/material/dialog';
import { VideoUploadFormComponent } from '../video-upload-form/video-upload-form.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import { CostComponent } from '../cost/cost.component';
import { AreYouSureComponent } from '../are-you-sure/are-you-sure.component';
import { BuyCreditsComponent } from '../buy-credits/buy-credits.component';
import { AchievementsComponent } from '../achievements/achievements.component';
import { BackgroundComponent } from '../background/background.component';
import { UpdateEmailComponent } from '../update-email/update-email.component';
import { AngularFireAnalytics } from '@angular/fire/analytics';

@Component({
  selector: 'app-profile-actions',
  templateUrl: './profile-actions.component.html',
  styleUrls: ['./profile-actions.component.scss']
})
export class ProfileActionsComponent {  

  @Input() parent: any;


  constructor(public analytics: AngularFireAnalytics, public  auth: AuthService, public dialog: MatDialog, private _snackBar: MatSnackBar) {}

  uploadVideo( ): void {
    const dialogRef = this.dialog.open(VideoUploadFormComponent, {
      width: '900px',
      maxHeight : '80vh',
      disableClose: true,
      data: {}
    });
    this.analytics.logEvent('profile_action', {'action': 'uploadVideo'})
  }

  clickedDisabledUpload(credits) {
    if(credits == 0) {
      this._snackBar.open("Oop! Please purchase credits prior to uploading a video for review!", 'Close', {
        duration: 5000,
      });
    }
    this.analytics.logEvent('profile_action', {'action': 'clickedDisabledUpload'})
  }

  canUpload(credits): Boolean {
    if(credits == 0) {
      return true;
    } else {
      return false;
    }
  }

  purchaseCredits(){
    const dialogRef = this.dialog.open(BuyCreditsComponent, {
      height: '500px',
      width: '900px',
      maxHeight : '80vh',
      disableClose: true,
      data: {}
    });

    this.analytics.logEvent('profile_action', {'action': 'purchaseCredits'})
  }

  updatePrice(){
    const dialogRef = this.dialog.open(CostComponent, {
      height: '500px',
      width: '900px',
      maxHeight : '80vh',
      disableClose: true,
      data: {}
    });
    this.analytics.logEvent('profile_action', {'action': 'updatePrice'})
  }

  updateAcievements(){
    const dialogRef = this.dialog.open(AchievementsComponent, {
      height: '500px',
      width: '900px',
      maxHeight : '80vh',
      data: {},
      disableClose: true
    });
    this.analytics.logEvent('profile_action', {'action': 'updateAcievements'})
  }

  updateBackground() {
    const dialogRef = this.dialog.open(BackgroundComponent, {
      height: '500px',
      width: '900px',
      data: {},
      disableClose: true
    });
    this.analytics.logEvent('profile_action', {'action': 'updateBackground'})
  }

  updateEmail() {
    const dialogRef = this.dialog.open(UpdateEmailComponent, {
      height: '500px',
      width: '900px',
      maxHeight : '80vh',
      disableClose: true,
      data: {}
    });
    this.analytics.logEvent('profile_action', {'action': 'updateEmail'})
  }


  toggleFlip(event: any, activeUser: boolean){
    var newStatus, statusMessage, btnMessage;

    if(activeUser === true) {
      newStatus = 'inactive';
      statusMessage = 'Users will not be able to upload new videos for you to review until your account becomes active again.';
      btnMessage = 'Deactivate Your Account'

      event.source.checked = true;

    } else {
      newStatus = 'active';
      statusMessage = 'Users will now be able to upload new videos for you to review.';
      btnMessage = 'Activate Your Account'

      event.source.checked = false;
    }

    const dialogRef = this.dialog.open(AreYouSureComponent, {
      width: '500px',
      maxHeight : '80vh',
      data: {
        submit: function(){
          this.event.source.checked = newStatus === 'active' ? true : false;
          this.auth.updateCoachStatus(newStatus);
        }, 
        message: 'Are you sure you want to switch your account status to ' + newStatus + '? ' + statusMessage,
        submitButton: btnMessage,
        snackMessageOnsubmit : 'Your Account Status has been updated to ' + newStatus,
        auth: this.auth,
        event: event}
    });
    this.analytics.logEvent('profile_action', {'action': 'updateCoachStatus'})
  }

  toggleEmailCheck(event: any, notificationsVal: String) {
    var newStatus, statusMessage, btnMessage;

    if(notificationsVal === 'email'){
      newStatus = 'none';
      statusMessage = 'You will no longer be notified by email or text about the status of reviews as well as other import CCS updates.';
      btnMessage = 'Turn Off Email Notifications'
      event.source.checked = true;

    } else if(notificationsVal === 'text'){
      newStatus = 'both';
      statusMessage = 'Standard messaging rates apply.';
      btnMessage = 'Turn On Email Notifications'
      event.source.checked = false;

    } else if(notificationsVal === 'both'){
      newStatus = 'text';
      statusMessage = 'You will no longer receive email updates.';
      btnMessage = 'Turn Off Email Notifications'
      event.source.checked = true;

    } else if(notificationsVal === 'none'){
      newStatus = 'email';
      statusMessage = 'You will now receive important email updates about your account in order to stay up to date with the status of your reviews. Standard messaging rates apply.';
      btnMessage = 'Turn On Email Notifications'
      event.source.checked = false;

    }

    const dialogRef = this.dialog.open(AreYouSureComponent, {
      width: '500px',
      maxHeight : '80vh',
      data: {
        submit: function(){
          this.auth.updateUserData({'notifications': newStatus});
          this.event.source.checked = (newStatus === 'email' || newStatus === 'both') ? true : false;
        }, 
        message: 'Are you sure you want to switch your preferred method of notification to ' + newStatus + '? ' + statusMessage,
        submitButton: btnMessage,
        snackMessageOnsubmit : 'We have updated your preferred method of contact to ' + newStatus,
        auth: this.auth,
        event: event}
    });
    this.analytics.logEvent('profile_action', {'action': 'changeEmailStatus', 'newStatus': newStatus})
  }

  toggleTextCheck(event: any, notificationsVal: String) {
    var newStatus, statusMessage, btnMessage;

    if(notificationsVal === 'email'){
      newStatus = 'both';
      statusMessage = 'Standard messaging rates apply.';
      btnMessage = 'Turn On Text Notifications'
      event.source.checked = false;

    } else if(notificationsVal === 'text'){
      newStatus = 'none';
      statusMessage = 'You will no longer be notified by email or text about the status of reviews as well as other import CCS updates.';
      btnMessage = 'Turn Off Text Notifications'
      event.source.checked = true;

    } else if(notificationsVal === 'both'){
      newStatus = 'email';
      statusMessage = 'You will no longer receive text updates.';
      btnMessage = 'Turn Off Text Notifications'
      event.source.checked = true;

    } else if(notificationsVal === 'none'){
      newStatus = 'text';
      statusMessage = 'You will now receive important email updates about your account in order to stay up to date with the status of your reviews. Standard messaging rates apply.';
      btnMessage = 'Turn On Text Notifications'
      event.source.checked = false;
    }

    const dialogRef = this.dialog.open(AreYouSureComponent, {
      width: '500px',
      maxHeight : '80vh',
      data: {
        submit: function(){
          this.auth.updateUserData({'notifications': newStatus});
          this.event.source.checked = (newStatus === 'text' || newStatus === 'both') ? true : false;
        }, 
        message: 'Are you sure you want to switch your preferred method of notification to ' + newStatus + '? ' + statusMessage,
        submitButton: btnMessage,
        snackMessageOnsubmit : 'We have updated your preferred method of contact to ' + newStatus,
        auth: this.auth,
        event: event}
    });

    this.analytics.logEvent('profile_action', {'action': 'changeTextStatus', 'newStatus': newStatus})

  }

}
