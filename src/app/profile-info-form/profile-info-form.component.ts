import { Component, Inject, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {startWith, map} from 'rxjs/operators';
import { AuthService } from '../core/auth.service';
import { AreYouSureComponent } from '../are-you-sure/are-you-sure.component';
import {MatDialog} from '@angular/material/dialog';
import { AngularFireAnalytics } from '@angular/fire/analytics';

export interface StateGroup {
  letter: string;
  names: string[];
}

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
};

@Component({
  selector: 'app-profile-info-form',
  templateUrl: './profile-info-form.component.html',
  styleUrls: ['./profile-info-form.component.scss'],
})
export class ProfileInfoFormComponent  implements OnInit {

  onSubmit(ProfileInfoForm) {
    this.auth.updateUserData(ProfileInfoForm.value);
    this.dialogRef.close();
    if(this.data.endSubmitFunction) {
      this.data.endSubmitFunction();
    }
    this.analytics.logEvent('updated_profile_info', ProfileInfoForm) 
  }

  cancel(ProfileInfoForm: any) {
    if(ProfileInfoForm.dirty) {
      this.dialog.open(AreYouSureComponent, {
        width: '500px',
        maxHeight : '80vh',
        data: {
          submit: function(){
            this.dialogRef.close(); 
          }, 
          message: 'Are you sure you want to cancel? Any changes you made will be lost.',
          submitButton: 'Lose Updates',
          cancelButton: 'Keep working',
          dialogRef: this.dialogRef
        }
      });
    } else {
      this.dialogRef.close(); 
    }
    this.analytics.logEvent('cancelled_update_profile_info', {}) 


  }

  stateGroups: StateGroup[] = 
  [
    {
      letter: 'A',
      names: ['Alabama', 'Alaska', 'Arizona', 'Arkansas']
    }, {
      letter: 'C',
      names: ['California', 'Colorado', 'Connecticut']
    }, {
      letter: 'D',
      names: ['Delaware']
    }, {
      letter: 'F',
      names: ['Florida']
    }, {
      letter: 'G',
      names: ['Georgia']
    }, {
      letter: 'H',
      names: ['Hawaii']
    }, {
      letter: 'I',
      names: ['Idaho', 'Illinois', 'Indiana', 'Iowa']
    }, {
      letter: 'K',
      names: ['Kansas', 'Kentucky']
    }, {
      letter: 'L',
      names: ['Louisiana']
    }, {
      letter: 'M',
      names: ['Maine', 'Maryland', 'Massachusetts', 'Michigan',
        'Minnesota', 'Mississippi', 'Missouri', 'Montana']
    }, {
      letter: 'N',
      names: ['Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
        'New Mexico', 'New York', 'North Carolina', 'North Dakota']
    }, {
      letter: 'O',
      names: ['Ohio', 'Oklahoma', 'Oregon']
    }, {
      letter: 'P',
      names: ['Pennsylvania']
    }, {
      letter: 'R',
      names: ['Rhode Island']
    }, {
      letter: 'S',
      names: ['South Carolina', 'South Dakota']
    }, {
      letter: 'T',
      names: ['Tennessee', 'Texas']
    }, {
      letter: 'U',
      names: ['Utah']
    }, {
      letter: 'V',
      names: ['Vermont', 'Virginia']
    }, {
      letter: 'W',
      names: ['Washington', 'West Virginia', 'Wisconsin', 'Wyoming']
    }
  ];

  stateGroupOptions: Observable<StateGroup[]>;

  constructor( public analytics: AngularFireAnalytics, public dialog: MatDialog, public dialogRef: MatDialogRef<ProfileInfoFormComponent>, 
    @Inject(MAT_DIALOG_DATA) public data, public auth: AuthService) {}

  ngOnInit() {
    this.stateGroupOptions = this.auth.userDoc$
      .pipe(
        startWith(''),
        map(value => this._filterGroup(value['State']))
      );
  }

  private _filterGroup(value: string): StateGroup[] {
    if (value) {
      return this.stateGroups
        .map(group => ({letter: group.letter, names: _filter(group.names, value)}))
        .filter(group => group.names.length > 0);
    }

    return this.stateGroups;
  }
}


