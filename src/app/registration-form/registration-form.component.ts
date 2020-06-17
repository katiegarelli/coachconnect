import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import { AuthService } from '../core/auth.service';
import {  Router  } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import {MatDialog} from '@angular/material/dialog';
import { TermsAndConditionsComponent } from '../terms-and-conditions/terms-and-conditions.component';

export interface StateGroup {
  letter: string;
  names: string[];
}

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
};

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss']
})
export class RegistrationFormComponent implements OnInit {
  email : string = "";
  password : string = "";
  displayName : string = "";
  lastName : string = "";
  dob : Date = new Date();
  yearsExperience : number = 1;
  phoneNumberA : string = "";
  phoneNumberB : string = "";
  phoneNumberC : string = "";
  address1 : string = "";
  address2 : string = "";
  City : string = "";
  State : string = "";
  Zip : string = "";
  agreedToTerms : boolean = false;

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

  constructor(public analytics: AngularFireAnalytics, public dialog: MatDialog, private auth: AuthService, private router: Router, private _snackBar: MatSnackBar) {}

  ngOnInit() {
  }

  private _filterGroup(value: string): StateGroup[] {
    if (value) {
      return this.stateGroups
        .map(group => ({letter: group.letter, names: _filter(group.names, value)}))
        .filter(group => group.names.length > 0);
    }

    return this.stateGroups;
  }

  backToLogin() {
    this.router.navigate(['/login']);
    this.analytics.logEvent('back_to_login_from_registration', {});
  }

  onSubmit(form){
    this.auth.signUp(form.value);
    this.analytics.logEvent('submit_registration', form.value);
  }

  clickDisabled(disabled: boolean, agreedToTerms: boolean) {
    if(disabled) {
      this._snackBar.open("Oop! Please complete the registration form before creating an account", 'Close', {
        duration: 5000,
      });
      this.analytics.logEvent('submit_disabled_registration', {'disabled': disabled, 'agreedToTerms': agreedToTerms});
    }

    if(!agreedToTerms) {
      this._snackBar.open("Oop! Please accept the terms and conditions before creating an account", 'Close', {
        duration: 5000,
      });
      this.analytics.logEvent('submit_disabled_registration', {'disabled': disabled, 'agreedToTerms': agreedToTerms});
    }
  }

  launchTerms() {
    this.dialog.open(TermsAndConditionsComponent, {
      width: '1000px',
      maxHeight : '80vh',
      data: {}
    });

    this.analytics.logEvent('launch_terms_and_conditions', {});

  }

}


