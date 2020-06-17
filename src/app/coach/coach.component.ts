import { Component, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AuthService } from '../core/auth.service';


export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'coach-component',
  templateUrl: './coach.component.html',
  styleUrls: ['./coach.component.scss']
})

export class CoachComponent {

  coach$: any;
  imgSrc: string;

  constructor(
    public dialogRef: MatDialogRef<CoachComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private auth: AuthService) {
      this.coach$ = this.auth.getCoach$(data['id']);
      this.imgSrc = data['img'];
    }
}