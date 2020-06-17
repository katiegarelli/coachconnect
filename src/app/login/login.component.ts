import { Component } from '@angular/core';
import {AuthProvider} from 'ngx-auth-firebaseui';
import {MatSnackBar} from '@angular/material/snack-bar';
import {  Router  } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import {MatDialog} from '@angular/material/dialog';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

providers = AuthProvider;

constructor(public dialog: MatDialog, public analytics: AngularFireAnalytics, public auth: AuthService, private router: Router, private _snackBar: MatSnackBar) {}

  loginSuccess(event) {
    this.analytics.logEvent('login_success', event)
    this.router.navigate(['/platform']);
  }

  loginError(event) {
    if (event.message === "There is no user record corresponding to this identifier. The user may have been deleted.") {
      this._snackBar.open("No account exists with this email. If you wish to create an account, please click the 'Create an account' button.", 'Close', {
        duration: 5000,
      });
    } else if (event.message === "The password is invalid or the user does not have a password.") {
      this._snackBar.open("Incorrect Password", 'Close', {
        duration: 5000,
      });
    } else if (event.message !== "The popup has been closed by the user before finalizing the operation.") {
      this._snackBar.open("Oop! Something went wrong! Please retry again!", 'Close', {
        duration: 5000,
      });
    } else {
      this._snackBar.open('There was an error logging into your account. Please try again.', 'Close', {
        duration: 5000,
      });
    }
    this.analytics.logEvent('login_error', event)
  }

  registerAccount(event) {
    this.router.navigate(['/register']);
  }


  resetPassword(event){
    this.dialog.open(ForgotPasswordComponent, {
      width: '600px',
      maxHeight : '80vh',
      data: {}
    });
  }

}
