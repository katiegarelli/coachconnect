import { Component, OnInit } from '@angular/core';
import {  Router  } from '@angular/router';
import { AngularFireAnalytics } from '@angular/fire/analytics';

@Component({
  selector: 'app-how-it-works',
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.scss']
})
export class HowItWorksComponent implements OnInit {

  isLoading: boolean = true;

  constructor(public analytics: AngularFireAnalytics, private router: Router) { }

  ngOnInit() {
  }

  navToCoaches() {
    this.analytics.logEvent('nav_to_coaches_from_how_it_works', {})
    this.router.navigate(['/coaches']);
  }

  navToLogin() {
    this.analytics.logEvent('nav_to_register_from_how_it_works', {})
    this.router.navigate(['/register']);
  }

  navToPlatform() {
    this.analytics.logEvent('nav_to_platform_from_how_it_works', {})
    this.router.navigate(['/platform']);
  }

}
