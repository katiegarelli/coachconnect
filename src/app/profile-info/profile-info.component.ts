import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ProfileInfoFormComponent} from '../profile-info-form/profile-info-form.component'
import { AuthService } from '../core/auth.service';
import { AngularFireAnalytics } from '@angular/fire/analytics';

export interface User {
  role : String,
  displayName : String,
  lastName : String,
  dob : String,
  organizationIds: String,
  email : String,
  yearsExperience : String,
  phone : String,
  address1 : String,
  address2 : String,
  City : String,
  State : String,
  Zip : String,
  profPic : String,
  credits : String,
  videos: String[]
};

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss']
})
export class ProfileInfoComponent implements OnInit {

  constructor( public analytics: AngularFireAnalytics, public dialog: MatDialog, public auth: AuthService) {}

  editProps( ): void {
    const dialogRef = this.dialog.open(ProfileInfoFormComponent, {
      width: '900px',
      maxHeight : '80vh',
      disableClose: true,
      data: {title: 'Tell Us About Yourself'}});

    this.analytics.logEvent('open_edit_profile_info', {})

  }

  ngOnInit() {
  }

}