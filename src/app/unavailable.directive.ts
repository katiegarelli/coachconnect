
import { Input } from '@angular/core';
import { Directive } from '@angular/core';
import {FormBuilder, AbstractControl, Validator, NG_VALIDATORS, ValidatorFn} from '@angular/forms';


@Directive({
  selector: '[appUnavailable]',
  providers: [{provide: NG_VALIDATORS, useExisting: UnavailableDirective, multi: true}]

})
export class UnavailableDirective implements Validator {

  validate(control: AbstractControl): {[key: string]: any} | null {
    return this.canPurchase()(control);
  }

  /** a use cant choose a coach if the coaches status is inactive */
  canPurchase(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      if(!control.value) {
        return null;
      }

      const status = control.value.split("|", 4)[3];

      return (status === 'inactive') ? {'coachInactive': {}} : null;
    };
  }

}
