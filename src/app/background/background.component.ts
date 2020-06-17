import { Component } from '@angular/core';
import { AuthService } from '../core/auth.service';
import {MatDialogRef} from '@angular/material/dialog';
import { AreYouSureComponent } from '../are-you-sure/are-you-sure.component';
import {MatDialog} from '@angular/material/dialog';
import { AngularFireAnalytics } from '@angular/fire/analytics';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})
export class BackgroundComponent {

  constructor(public analytics: AngularFireAnalytics, public dialog: MatDialog, public  auth: AuthService, public dialogRef: MatDialogRef<BackgroundComponent>) { }

  onSubmit(BackgroundForm: any) {
    this.auth.updateUserData(BackgroundForm.value);
    this.dialogRef.close(); 
    this.analytics.logEvent('background_updated', {})
  }

  cancel(BackgroundForm: any, user: any) {
    if(BackgroundForm.dirty) {
      this.dialog.open(AreYouSureComponent, {
        width: '500px',
        maxHeight : '80vh',
        data: {
          submit: function(){
            this.dialogRef.close(); 
          }, 
          message: 'Are you sure you want to cancel? Any changes you made to your background will be lost.',
          submitButton: 'Lose Updates',
          cancelButton: 'Keep working',
          dialogRef: this.dialogRef
        }
      });
    } else {
      this.dialogRef.close(); 
    }
    this.analytics.logEvent('cancelled_background_updated', {})

  }

}
