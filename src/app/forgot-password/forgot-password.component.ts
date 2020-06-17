import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  email : string = "";

  constructor( public auth: AuthService, private _snackBar: MatSnackBar, public dialogRef: MatDialogRef<ForgotPasswordComponent>) { }

  ngOnInit() {
  }

  onSubmit(passwordForm: any) {
    this.auth.resetPassword(passwordForm.value.email)
    .then(() => {
      this.dialogRef.close(); 
      this._snackBar.open("A 'password reset' email has been sent to : " + passwordForm.value.email, 'Close', {
        duration: 5000,
      });
    })
    .catch((error) => {
      if(error == "Error: There is no user record corresponding to this identifier. The user may have been deleted.") {
        this._snackBar.open("No user exists with this email address.", 'Close', {
          duration: 5000,
        });
      } else {
        this._snackBar.open(error, 'Close', {
          duration: 5000,
        });
      }

    });
  }

}
