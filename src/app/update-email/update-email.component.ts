import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialogRef} from '@angular/material/dialog';
import { AngularFireAnalytics } from '@angular/fire/analytics';

@Component({
  selector: 'app-update-email',
  templateUrl: './update-email.component.html',
  styleUrls: ['./update-email.component.scss']
})
export class UpdateEmailComponent implements OnInit {

  email: string = "";
  password: string = "";

  constructor(public analytics: AngularFireAnalytics, private auth: AuthService, private _snackBar: MatSnackBar, public dialogRef: MatDialogRef<UpdateEmailComponent>) { }

  ngOnInit() {
  }

  onSubmit(form){
    this.auth.updateEmail(form.value['email'], form.value['password']).then(() => {
        this.dialogRef.close(); 
        this._snackBar.open("Successfully updated your email. Please verify this new email address asap.", 'Close', {
          duration: 5000,
        });
        this.analytics.logEvent('email_updated_successfully', {});

    }).catch(err => {
      this._snackBar.open("Unable to update email. Be sure to enter your CURRENT password", 'Close', {
        duration: 5000,
      });
      this.analytics.logEvent('email_update_errored', {});
    });
  }

}
