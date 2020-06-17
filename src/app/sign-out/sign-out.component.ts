import { Component } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { AngularFireAnalytics } from '@angular/fire/analytics';

@Component({
  selector: 'app-sign-out',
  templateUrl: './sign-out.component.html',
  styleUrls: ['./sign-out.component.sass']
})
export class SignOutComponent {

  constructor(public analytics: AngularFireAnalytics, private auth: AuthService) {
    auth.signOut();
    this.analytics.logEvent('user_signed_out', {});
  }

}
