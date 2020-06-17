import { Component } from '@angular/core';
import { AuthService } from '../core/auth.service';
import {MatDialogRef} from '@angular/material/dialog';
import { AreYouSureComponent } from '../are-you-sure/are-you-sure.component';
import {MatDialog} from '@angular/material/dialog';
import { AngularFireAnalytics } from '@angular/fire/analytics';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.sass']
})
export class AchievementsComponent {

  constructor(public analytics: AngularFireAnalytics, public dialog: MatDialog, public  auth: AuthService, public dialogRef: MatDialogRef<AchievementsComponent>) {}

  updatedArray: string[];

  addItemInputName:string;


  updateAchievements(achievement: string, remove: boolean, achievements : string[]) {

    if(this.updatedArray) {
      achievements = this.updatedArray;
    }

    if(remove) {
      const index: number = achievements.indexOf(achievement);
      if (index !== -1) {
        achievements.splice(index, 1);
        this.updatedArray = achievements;
      }  
    } else {
      this.updatedArray = achievements;
      this.updatedArray.push(achievement);
      this.addItemInputName = '';
    }

  }

  save() {
    if(this.updatedArray) {
      this.auth.updateUserData({'achievements': this.updatedArray});
      this.analytics.logEvent('achievements_updated', {});

    }
    this.dialogRef.close(); 
  }

  cancel() {
    if(this.updatedArray) {
      const dialogRef = this.dialog.open(AreYouSureComponent, {
        width: '500px',
        maxHeight : '80vh',
        data: {
          submit: function(){
            this.dialogRef.close(); 
          }, 
          message: 'Are you sure you want to cancel? Any changes you made to your achievements will be lost.',
          submitButton: 'Lose Updates',
          cancelButton: 'Keep working',
          dialogRef: this.dialogRef
        }
      });
    } else {
      this.dialogRef.close(); 
    }

  }

}
