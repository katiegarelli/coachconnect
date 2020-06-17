import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import { AuthService } from '../core/auth.service';
import { AngularFireAnalytics } from '@angular/fire/analytics';


@Component({
  selector: 'app-cost',
  templateUrl: './cost.component.html',
  styleUrls: ['./cost.component.scss']
})
export class CostComponent {

  constructor( public analytics: AngularFireAnalytics, public auth: AuthService,public dialogRef: MatDialogRef<CostComponent>) { }

  onSubmit(CostForm) {
    this.auth.updateCost(CostForm.value);
    this.dialogRef.close(); 
    this.analytics.logEvent('coach_price_updated', {CostForm})
  }

}
