import { Component, OnInit } from '@angular/core';
import {  Router  } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-account-header',
  templateUrl: './account-header.component.html',
  styleUrls: ['./account-header.component.scss']
})
export class AccountHeaderComponent implements OnInit {

  constructor(private router: Router, public auth : AuthService) { }

  ngOnInit() {
  }

  launchPlatform() {
    this.router.navigate(['/platform']);
  }

}
