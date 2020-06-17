import { Component } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import { AuthService } from '../core/auth.service';
import { AngularFireAnalytics } from '@angular/fire/analytics';


@Component({
  selector: 'app-buy-credits',
  templateUrl: './buy-credits.component.html',
  styleUrls: ['./buy-credits.component.scss']
})
export class BuyCreditsComponent {

  creditsToBuy : number = 30;  
  loading: boolean = false;

  constructor(public analytics: AngularFireAnalytics, private auth: AuthService,public dialogRef: MatDialogRef<BuyCreditsComponent>) { }

  updateloadingPurchase(event) {
    this.loading = event;
  }
}
