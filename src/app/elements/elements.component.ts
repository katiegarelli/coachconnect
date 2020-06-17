import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialogRef} from '@angular/material/dialog';

declare var Stripe; // : stripe.StripeStatic;

@Component({
  selector: 'app-elements',
  templateUrl: './elements.component.html',
  styleUrls: ['./elements.component.scss']
})
export class ElementsComponent implements OnInit {


  constructor(public dialogRef: MatDialogRef<ElementsComponent>, private _snackBar: MatSnackBar, public analytics: AngularFireAnalytics, private auth: AuthService, private functions: AngularFireFunctions) {}

  @Input() amount: number;
  @Input() description: string;
  @ViewChild('cardElement', {static: true}) cardElement: ElementRef;

  @Output()
  private loadingPurchase = new EventEmitter();

  stripe; // : stripe.Stripe;
  card;
  cardErrors;

  loading = false;

  ngOnInit() {
    this.stripe = Stripe('pk_live_a4ruUKrXDyjbgPKCf7QP2QLZ00uaXMBINY');
    const elements = this.stripe.elements();

    this.card = elements.create('card');
    this.card.mount(this.cardElement.nativeElement);

    this.card.addEventListener('change', ({ error }) => {
        this.cardErrors = error && error.message;
    });
  }

  async handleForm(e) {
    e.preventDefault();

    const { source, error } = await this.stripe.createSource(this.card);

    if (error) {
      // Inform the customer that there was an error.
      this.analytics.logEvent('card_error', {'error': error.message});

      this._snackBar.open( error.message, 'Close', {
        duration: 5000,
      });

    } else {
      // Send the token to your server.
      this.loadingPurchase.emit(true);
      this.loading = true;
      const user = await this.auth.getUser();
      const fun = this.functions.httpsCallable('stripeCreateCharge');
      await fun({ source: source.id, uid: user.uid, amount: this.amount }).toPromise().then(()=> {
        this.auth.purchaseCredits(this.amount);
        this.analytics.logEvent('successfully_charged_credit_card', { source: source.id, uid: user.uid, amount: this.amount })
        this.loading = false;
        this.loadingPurchase.emit(false);
        this.dialogRef.close(); 
        this._snackBar.open("Thank you for your purchase!", 'Close', {
          duration: 5000,
        });
      });

    }
  }

}