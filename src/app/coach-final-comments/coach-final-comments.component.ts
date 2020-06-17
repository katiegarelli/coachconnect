import { Component, Inject } from '@angular/core';
import { AuthService } from '../core/auth.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AreYouSureComponent } from '../are-you-sure/are-you-sure.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AngularFireAnalytics } from '@angular/fire/analytics';

@Component({
  selector: 'app-coach-final-comments',
  templateUrl: './coach-final-comments.component.html',
  styleUrls: ['./coach-final-comments.component.scss']
})
export class CoachFinalCommentsComponent {

  constructor(public analytics: AngularFireAnalytics, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, public  auth: AuthService, public dialogRef: MatDialogRef<CoachFinalCommentsComponent>, private _snackBar: MatSnackBar) { }

  onSubmit(finalCommentsForm: any) {
    this.auth.updateVideoStatus(this.data.id, this.data.status, this.data.creditsCharged, finalCommentsForm.value).then((data: any) => {
      this.dialogRef.close(); 
      this._snackBar.open('Your Video Review has been Completed!', 'Close', {
        duration: 5000,
      });
      this.analytics.logEvent('video_review_completed', {'id': this.data.id})
    });
  }

  cancel(finalCommentsForm: any, user: any) {
    if(finalCommentsForm.dirty) {
      this.dialog.open(AreYouSureComponent, {
        width: '500px',
        maxHeight : '80vh',
        data: {
          submit: function(){
            this.dialogRef.close(); 
          }, 
          message: 'Are you sure you want to cancel? Any written comments will be lost.',
          submitButton: 'Lose Written Comments',
          cancelButton: 'Keep writing',
          dialogRef: this.dialogRef
        }
      });
    } else {
      this.dialogRef.close(); 
    }
    this.analytics.logEvent('cancel_final_video_comments', {'id': this.data.id})

  }
}
