import { Input } from '@angular/core';
import { Directive } from '@angular/core';
import {FormBuilder, AbstractControl, Validator, NG_VALIDATORS, ValidatorFn} from '@angular/forms';


@Directive({
  selector: '[appCanPurchase]',
  providers: [{provide: NG_VALIDATORS, useExisting: CanPurchaseDirective, multi: true}]
})
export class CanPurchaseDirective implements Validator {
  @Input('appCanPurchase') availableCredits: number;

  validate(control: AbstractControl): {[key: string]: any} | null {
    return this.availableCredits ? this.canPurchase(this.availableCredits)(control) : null;
  }

  /** a use cant choose a coach if their credits arent hight enough */
  canPurchase(availableCredits: number): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      if(!control.value) {
        return null;
      }
      const coachCredits = parseInt((control.value.split("|", 4)[2]), 10);
      return (availableCredits < coachCredits) ? {'forbiddenPurchase': {'yourCredits': availableCredits, 'coachCredits': coachCredits}} : null;
    };
  }

}
