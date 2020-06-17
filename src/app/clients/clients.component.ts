import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config.service';
import { CoachComponent } from '../coach/coach.component';
import {MatDialog} from '@angular/material/dialog';
import { AuthService } from '../core/auth.service';
import { AngularFireAnalytics } from '@angular/fire/analytics';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {

  clients;
  name: string;
  isLoading: boolean = true;

  constructor(public analytics: AngularFireAnalytics, private config: ConfigService, public dialog: MatDialog, public auth: AuthService) {}

  ngOnInit() {
    this.clients = this.getClients();

    if(!this.auth.coachesMap$) {
      this.auth.getCoachesForDropdown();
    }
  }
  
  getClients() {
    this.analytics.logEvent('get_all_coaches', {})
    return this.config.getConfig().clients;
  }

  open( id: string, coachImg : string ): void {
    this.analytics.logEvent('coach_component_opened', {'coach': id})
    const dialogRef = this.dialog.open(CoachComponent, {
      width: '700px',
      maxHeight : '80vh',
      data: {'img': coachImg, 'id': id}
    });
  }

}
